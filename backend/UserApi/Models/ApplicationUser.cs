using Microsoft.AspNetCore.Identity;

namespace UserApi.Models;

public class ApplicationUser : IdentityUser<long>
{
    // Identity provides:
    // - Id, UserName, Email, PasswordHash, SecurityStamp, ConcurrencyStamp
    // - PhoneNumber, TwoFactorEnabled, LockoutEnabled, LockoutEnd, AccessFailedCount, etc.
    
    // Custom properties
    public int TokenCount { get; set; }
    public string SubscriptionType { get; set; } = "free"; // "free", "pro", "enterprise"
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    public DateTime? LastLogin { get; set; }
    public bool IsActive { get; set; } = true;
    
    // Email 2FA
    public bool IsEmailTwoFactorEnabled { get; set; } = false;
    public string? EmailTwoFactorCode { get; set; }
    public DateTime? EmailTwoFactorCodeExpiry { get; set; }
    
    // Navigation properties
    public ICollection<RefreshToken> RefreshTokens { get; set; } = new List<RefreshToken>();
}

