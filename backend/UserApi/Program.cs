using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using System.Text;
using UserApi.Models;
using UserApi.Services;
using Pomelo.EntityFrameworkCore.MySql;  // EF Core MySQL provider extension methods

var builder = WebApplication.CreateBuilder(args);

// Add services to the container.

builder.Services.AddControllers()
    .AddJsonOptions(options =>
    {
        options.JsonSerializerOptions.PropertyNamingPolicy = System.Text.Json.JsonNamingPolicy.CamelCase;
    });

// Learn more about configuring OpenAPI at https://aka.ms/aspnet/openapi
builder.Services.AddOpenApi();

// Register email service
builder.Services.AddScoped<IEmailService, SmtpEmailService>();

// Configure DbContext
// during development you can point this at a local MySQL instance;
// when the app is deployed the connection string is pulled from
// configuration (see appsettings.json or Azure Web App connection strings).
var connectionString = builder.Configuration.GetConnectionString("DefaultConnection");

builder.Services.AddDbContext<UserContext>(opt =>
{
    if (!string.IsNullOrWhiteSpace(connectionString))
    {
        // use the Pomelo provider; requires the NuGet package
        opt.UseMySql(connectionString,
            ServerVersion.AutoDetect(connectionString));
    }
    else
    {
        // fall back to in‑memory for quick local debugging without a database
        opt.UseInMemoryDatabase("Users");
    }
});

// Configure ASP.NET Core Identity
builder.Services
    .AddIdentity<ApplicationUser, IdentityRole<long>>(options =>
    {
        // Password settings
        options.Password.RequiredLength = 8;
        options.Password.RequireDigit = true;
        options.Password.RequireNonAlphanumeric = false;
        options.Password.RequireUppercase = true;
        options.Password.RequireLowercase = true;

        // Lockout settings
        options.Lockout.DefaultLockoutTimeSpan = TimeSpan.FromMinutes(15);
        options.Lockout.MaxFailedAccessAttempts = 5;
        options.Lockout.AllowedForNewUsers = true;

        // User settings
        options.User.RequireUniqueEmail = true;

        // SignIn settings
        options.SignIn.RequireConfirmedEmail = false;
    })
    .AddEntityFrameworkStores<UserContext>()
    .AddDefaultTokenProviders();

builder.Services.AddAuthentication(options =>
{
    options.DefaultAuthenticateScheme = JwtBearerDefaults.AuthenticationScheme;
    options.DefaultChallengeScheme = JwtBearerDefaults.AuthenticationScheme;
})
.AddJwtBearer(options =>
{
    options.TokenValidationParameters = new TokenValidationParameters
    {
        ValidateIssuer = true,
        ValidateAudience = true,
        ValidateLifetime = true,
        ValidateIssuerSigningKey = true,
        ValidIssuer = builder.Configuration["Jwt:Issuer"],
        ValidAudience = builder.Configuration["Jwt:Audience"],
        IssuerSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(builder.Configuration["Jwt:Key"] ?? ""))
    };
});

builder.Services.AddAuthorization();

// Add CORS policy for development and production
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowReactApp", builder =>
    {
        var allowedOrigins = new[]
        {
            "https://uploadsoul-cjakere2gqa4a6cb.canadacentral-01.azurewebsites.net/",
            "http://localhost:5173",
            "http://localhost:5266",
        };

        builder.WithOrigins(allowedOrigins)
               .AllowAnyMethod()
               .AllowAnyHeader();
    });
});

// <snippet_UseSwagger>
var app = builder.Build();

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.MapOpenApi();
    app.UseSwaggerUi(options =>
    {
        options.DocumentPath = "/openapi/v1.json";
    });
}
// </snippet_UseSwagger>



app.UseCors("AllowReactApp");

app.UseAuthentication();
app.UseAuthorization();

app.UseDefaultFiles();          // looks for index.html by default
app.UseStaticFiles();           // serves files from wwwroot

app.MapControllers();

// fallback to index.html for client‑side routing
app.MapFallbackToFile("index.html");

app.Run();