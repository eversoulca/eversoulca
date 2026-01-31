using System.Text.Json.Serialization;

namespace UserApi.Models;

public class User
{
    public long Id { get; set; }
    
    public string? Username { get; set; }
    
    public string? Password { get; set; }
}