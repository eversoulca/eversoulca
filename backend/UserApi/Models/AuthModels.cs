namespace UserApi.Models;

public class RegisterRequest
{
    public string Username { get; set; } = string.Empty;
    public string Email { get; set; } = string.Empty;
    public string Password { get; set; } = string.Empty;
}

public class VerifyTwoFactorRequest
{
    public string Code { get; set; } = string.Empty;
}

public class RefreshTokenRequest
{
    public string RefreshToken { get; set; } = string.Empty;
}

public class VerifyEmailTwoFactorRequest
{
    public string Code { get; set; } = string.Empty;
}

public class EnableEmailTwoFactorRequest
{
    public bool Enable { get; set; }
}

