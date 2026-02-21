using System.Text.Json.Serialization;

namespace UserApi.Models;

// This file is kept for reference only.
// The User model has been replaced by ApplicationUser which extends IdentityUser<long>.
// See ApplicationUser.cs for the current user model implementation.

// Old User model (DEPRECATED):
/*
public class User
{
    public long Id { get; set; }
    public string Username { get; set; }
    public string Email { get; set; }
    public string Password { get; set; }
    public int TokenCount { get; set; }
    public string SubscriptionType { get; set; }
    public DateTime CreatedAt { get; set; }
    public DateTime? LastLogin { get; set; }
    public bool IsActive { get; set; }
    public List<RefreshToken> RefreshTokens { get; set; }
}
*/
