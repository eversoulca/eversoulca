using System;
using System.Collections.Generic;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Configuration;
using Microsoft.IdentityModel.Tokens;
using UserApi.Models;
using UserApi.Services;

namespace UserApi.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class AuthController : ControllerBase
    {
        private readonly UserManager<ApplicationUser> _userManager;
        private readonly SignInManager<ApplicationUser> _signInManager;
        private readonly IConfiguration _configuration;
        private readonly IEmailService _emailService;
        private readonly ILogger<AuthController> _logger;

        public AuthController(
            UserManager<ApplicationUser> userManager,
            SignInManager<ApplicationUser> signInManager,
            IConfiguration configuration,
            IEmailService emailService,
            ILogger<AuthController> logger)
        {
            _userManager = userManager;
            _signInManager = signInManager;
            _configuration = configuration;
            _emailService = emailService;
            _logger = logger;
        }

        // POST: api/auth/register
        [HttpPost("register")]
        public async Task<IActionResult> Register([FromBody] RegisterRequest request)
        {
            if (!ModelState.IsValid)
                return BadRequest(ModelState);

            if (await _userManager.FindByNameAsync(request.Username) != null)
                return BadRequest(new { error = "Username already exists" });

            if (await _userManager.FindByEmailAsync(request.Email) != null)
                return BadRequest(new { error = "Email already registered" });

            var user = new ApplicationUser
            {
                UserName = request.Username,
                Email = request.Email,
                SubscriptionType = "free",
                TokenCount = 100
            };

            var result = await _userManager.CreateAsync(user, request.Password);

            if (!result.Succeeded)
                return BadRequest(new { errors = result.Errors });

            return Ok(new { message = "User registered successfully" });
        }

        // POST: api/auth/login
        [HttpPost("login")]
        public async Task<IActionResult> Login([FromBody] LoginRequest request)
        {
            if (string.IsNullOrEmpty(request.Username) || string.IsNullOrEmpty(request.Password))
                return BadRequest(new { error = "Username and password are required" });

            var user = await _userManager.FindByNameAsync(request.Username);
            if (user == null || !(await _userManager.CheckPasswordAsync(user, request.Password)))
                return Unauthorized(new { error = "Invalid username or password" });

            if (!user.IsActive)
                return Unauthorized(new { error = "User account is inactive" });

            // Check if account is locked
            if (await _userManager.IsLockedOutAsync(user))
                return Unauthorized(new { error = "Account is locked. Try again later" });

            // Check if email 2FA is enabled
            if (user.IsEmailTwoFactorEnabled)
            {
                // Generate a 6-digit code, store it and send via email
                var code = GenerateEmailTwoFactorCode();
                user.EmailTwoFactorCode = code;
                user.EmailTwoFactorCodeExpiry = DateTime.UtcNow.AddMinutes(10);
                await _userManager.UpdateAsync(user);

                // Send code to user email
                await SendEmailTwoFactorCodeAsync(user.Email, code);
                _logger.LogInformation("[DEV] Email 2FA Code for {Email}: {Code}", user.Email, code);

                return Ok(new
                {
                    requiresEmailTwoFactor = true,
                    message = "A verification code has been sent to your email",
                    userId = user.Id // Return userId for client to use in verify endpoint
                });
            }

            var token = GenerateJwtToken(user);
            var refreshToken = GenerateRefreshToken();

            // Update last login
            user.LastLogin = DateTime.UtcNow;
            await _userManager.UpdateAsync(user);

            return Ok(new
            {
                accessToken = token,
                refreshToken = refreshToken,
                user = new
                {
                    id = user.Id,
                    username = user.UserName,
                    email = user.Email,
                    subscriptionType = user.SubscriptionType,
                    tokenCount = user.TokenCount
                }
            });
        }

        // POST: api/auth/refresh-token
        [HttpPost("refresh-token")]
        [Authorize]
        public async Task<IActionResult> RefreshToken([FromBody] RefreshTokenRequest request)
        {
            var username = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            var user = await _userManager.FindByNameAsync(username);

            if (user == null)
                return Unauthorized(new { error = "User not found" });

            var token = GenerateJwtToken(user);
            return Ok(new { accessToken = token });
        }

        // POST: api/auth/logout
        [HttpPost("logout")]
        [Authorize]
        public async Task<IActionResult> Logout()
        {
            await _signInManager.SignOutAsync();
            return Ok(new { message = "Logged out successfully" });
        }

        // GET: api/auth/me
        [HttpGet("me")]
        [Authorize]
        public async Task<IActionResult> GetCurrentUser()
        {
            var username = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            var user = await _userManager.FindByNameAsync(username);

            if (user == null)
                return NotFound();

            return Ok(new
            {
                id = user.Id,
                username = user.UserName,
                email = user.Email,
                subscriptionType = user.SubscriptionType,
                tokenCount = user.TokenCount,
                lastLogin = user.LastLogin,
                isActive = user.IsActive
            });
        }

        // POST: api/auth/enable-2fa
        [HttpPost("enable-2fa")]
        [Authorize]
        public async Task<IActionResult> EnableTwoFactorAuthentication()
        {
            var username = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            var user = await _userManager.FindByNameAsync(username);

            if (user == null)
                return NotFound();

            // Generate TOTP setup code
            var unformattedKey = await _userManager.GetAuthenticatorKeyAsync(user);
            if (string.IsNullOrEmpty(unformattedKey))
            {
                await _userManager.ResetAuthenticatorKeyAsync(user);
                unformattedKey = await _userManager.GetAuthenticatorKeyAsync(user);
            }

            // Format key for display (e.g., in QR code)
            var formattedKey = FormatKey(unformattedKey);

            return Ok(new
            {
                message = "Scan this QR code with an authenticator app (Google Authenticator, Authy, etc.)",
                key = formattedKey,
                // In production, generate QR code here
                qrCode = $"otpauth://totp/EverSoul:{user.Email}?secret={unformattedKey}&issuer=EverSoul"
            });
        }

        // POST: api/auth/verify-2fa
        [HttpPost("verify-2fa")]
        [Authorize]
        public async Task<IActionResult> VerifyTwoFactorAuthentication([FromBody] VerifyTwoFactorRequest request)
        {
            var username = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            var user = await _userManager.FindByNameAsync(username);

            if (user == null)
                return NotFound();

            var result = await _userManager.VerifyTwoFactorTokenAsync(user, TokenOptions.DefaultProvider, request.Code);

            if (!result)
                return BadRequest(new { error = "Invalid 2FA code" });

            await _userManager.SetTwoFactorEnabledAsync(user, true);
            return Ok(new { message = "Two-factor authentication enabled successfully" });
        }

        // POST: api/auth/verify-email-2fa
        // Used after login to verify email code
        [HttpPost("verify-email-2fa/{userId}")]
        public async Task<IActionResult> VerifyEmailTwoFactor(long userId, [FromBody] VerifyEmailTwoFactorRequest request)
        {
            var user = await _userManager.FindByIdAsync(userId.ToString());
            if (user == null)
                return NotFound(new { error = "User not found" });

            // Check if code matches and hasn't expired
            if (string.IsNullOrEmpty(user.EmailTwoFactorCode) || 
                user.EmailTwoFactorCode != request.Code || 
                DateTime.UtcNow > user.EmailTwoFactorCodeExpiry)
            {
                return BadRequest(new { error = "Invalid or expired verification code" });
            }

            // Clear the code
            user.EmailTwoFactorCode = null;
            user.EmailTwoFactorCodeExpiry = null;
            user.LastLogin = DateTime.UtcNow;
            await _userManager.UpdateAsync(user);

            // Generate JWT token
            var token = GenerateJwtToken(user);
            var refreshToken = GenerateRefreshToken();

            return Ok(new
            {
                accessToken = token,
                refreshToken = refreshToken,
                user = new
                {
                    id = user.Id,
                    username = user.UserName,
                    email = user.Email,
                    subscriptionType = user.SubscriptionType,
                    tokenCount = user.TokenCount
                }
            });
        }

        // POST: api/auth/enable-email-2fa
        [HttpPost("enable-email-2fa")]
        [Authorize]
        public async Task<IActionResult> EnableEmailTwoFactor([FromBody] EnableEmailTwoFactorRequest request)
        {
            var username = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            var user = await _userManager.FindByNameAsync(username);

            if (user == null)
                return NotFound();

            user.IsEmailTwoFactorEnabled = request.Enable;
            await _userManager.UpdateAsync(user);

            return Ok(new
            {
                message = request.Enable 
                    ? "Email 2FA enabled successfully" 
                    : "Email 2FA disabled successfully",
                isEmailTwoFactorEnabled = user.IsEmailTwoFactorEnabled
            });
        }

        private string GenerateJwtToken(ApplicationUser user)
        {
            var claims = new List<Claim>
            {
                new Claim(ClaimTypes.NameIdentifier, user.UserName ?? ""),
                new Claim(ClaimTypes.Email, user.Email ?? ""),
                new Claim("SubscriptionType", user.SubscriptionType),
                new Claim("TokenCount", user.TokenCount.ToString()),
                new Claim(JwtRegisteredClaimNames.Jti, Guid.NewGuid().ToString())
            };

            var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(_configuration["Jwt:Key"] ?? ""));
            var creds = new SigningCredentials(key, SecurityAlgorithms.HmacSha256);

            var token = new JwtSecurityToken(
                issuer: _configuration["Jwt:Issuer"],
                audience: _configuration["Jwt:Audience"],
                claims: claims,
                expires: DateTime.UtcNow.AddMinutes(15), // Short-lived access token
                signingCredentials: creds);

            return new JwtSecurityTokenHandler().WriteToken(token);
        }

        private string GenerateRefreshToken()
        {
            var randomNumber = new byte[32];
            using (var rng = System.Security.Cryptography.RandomNumberGenerator.Create())
            {
                rng.GetBytes(randomNumber);
                return Convert.ToBase64String(randomNumber);
            }
        }

        private string GenerateEmailTwoFactorCode()
        {
            var random = new Random();
            return random.Next(100000, 999999).ToString(); // 6-digit code
        }

        private string FormatKey(string unformattedKey)
        {
            var result = new StringBuilder();
            int index = 0;
            foreach (var c in unformattedKey)
            {
                if (index % 4 == 0)
                    result.Append(" ");

                result.Append(c);
                index++;
            }

            return result.ToString().TrimStart();
        }

        private async Task SendEmailTwoFactorCodeAsync(string email, string code)
        {
            try
            {
                var subject = "UploadSoul - Your Verification Code";
                var message = $@"
                    <html>
                        <body style='font-family: Arial, sans-serif;'>
                            <h2>Verify Your Login</h2>
                            <p>Your verification code is:</p>
                            <div style='font-size: 32px; font-weight: bold; letter-spacing: 5px; margin: 20px 0;'>
                                {code}
                            </div>
                            <p style='color: #666; font-size: 14px;'>
                                This code will expire in 10 minutes.
                            </p>
                            <p style='color: #999; font-size: 12px;'>
                                If you did not attempt to log in, please ignore this email.
                            </p>
                        </body>
                    </html>
                ";

                await _emailService.SendEmailAsync(email, subject, message);
                _logger.LogInformation("2FA email sent to {Email}", email);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Failed to send 2FA email to {Email}", email);
                throw;
            }
        }
      }
}
