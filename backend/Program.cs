using Backend.Data;
using Backend.Models;
using Backend.Services.Auth;
using Microsoft.EntityFrameworkCore;
using System.IdentityModel.Tokens;
using System.Security.Claims;
using System.Text;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.IdentityModel.Tokens;
using Microsoft.OpenApi.Models;
using Microsoft.Extensions.Options;


var builder = WebApplication.CreateBuilder(args);

builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen(c =>
{
    c.SwaggerDoc("v1", new OpenApiInfo { Title = "Backend API", Version = "v1" });
    var scheme = new OpenApiSecurityScheme
    {
        Name = "Authorization",
        Type = SecuritySchemeType.Http,
        Scheme = "bearer",
        BearerFormat = "JWT",
        In = ParameterLocation.Header,
        Description = "Enter: Bearer {JWT}"
    };
    c.AddSecurityDefinition("Bearer", scheme);
    c.AddSecurityRequirement(new OpenApiSecurityRequirement { [scheme] = Array.Empty<string>() });
});

var connStr = builder.Configuration.GetConnectionString("Default")
              ?? throw new Exception("Missing ConnectionStrings:Default");
builder.Services.AddDbContext<AppDbContext>(opt =>
    opt.UseNpgsql(connStr));


builder.Services.AddCors(o =>
{
    o.AddDefaultPolicy(p => p
        .AllowAnyHeader()
        .AllowAnyMethod()
        .AllowCredentials()
        .SetIsOriginAllowed(_ => true)); // dev-only
});

builder.Services.Configure<JwtOptions>(builder.Configuration.GetSection("Jwt"));
builder.Services.AddSingleton<IJwtTokenService, JwtTokenService>();

using var tmpProvider = builder.Services.BuildServiceProvider();
var jwt = tmpProvider.GetRequiredService<IOptions<JwtOptions>>().Value;

var signingKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(jwt.Key));
builder.Services.AddAuthentication("Bearer")
    .AddJwtBearer(opt =>
    {
        opt.TokenValidationParameters = new TokenValidationParameters
        {
            ValidateIssuer = true,
            ValidateAudience = true,
            ValidateLifetime = true,
            ValidateIssuerSigningKey = true,
            ValidIssuer = jwt.Issuer,
            ValidAudience = jwt.Audience,
            IssuerSigningKey = signingKey,
            ClockSkew = TimeSpan.FromSeconds(30)
        };
    });

builder.Services.AddAuthorization();

var app = builder.Build();

app.UseCors();

if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseAuthentication();
app.UseAuthorization();

app.MapPost("/auth/register", async (AppDbContext db, RegisterDto dto) =>
{
    if (string.IsNullOrWhiteSpace(dto.Username) || string.IsNullOrWhiteSpace(dto.Password))
        return Results.BadRequest(new { error = "Username and password are required" });

    var exists = await db.Users.AnyAsync(u => u.Username == dto.Username);
    if (exists) return Results.Conflict(new { error = "Username already exists" });

    var user = new User
    {
        Id = Guid.NewGuid(),
        Username = dto.Username,
        PasswordHash = BCrypt.Net.BCrypt.HashPassword(dto.Password),
        Name = dto.Name,
        Address = dto.Address,
        PhoneNumber = dto.PhoneNumber,
        CreatedAt = DateTime.UtcNow
    };
    db.Users.Add(user);
    await db.SaveChangesAsync();
    return Results.Created($"/users/{user.Id}", new { user.Id, user.Username });
})
.WithTags("Auth")
.Produces(StatusCodes.Status201Created)
.Produces(StatusCodes.Status400BadRequest)
.Produces(StatusCodes.Status409Conflict);

app.MapPost("/auth/login", async (AppDbContext db, IJwtTokenService tokens, LoginDto dto) =>
{
    var user = await db.Users.SingleOrDefaultAsync(u => u.Username == dto.Username);
    if (user is null) return Results.Unauthorized();
    if (!BCrypt.Net.BCrypt.Verify(dto.Password, user.PasswordHash)) return Results.Unauthorized();

    var access = tokens.Create(user);
    return Results.Ok(new { access_token = access, token_type = "Bearer" });
})
.WithTags("Auth")
.Produces(StatusCodes.Status200OK)
.Produces(StatusCodes.Status401Unauthorized);

app.MapGet("/api/testprotected", async (ClaimsPrincipal principal, AppDbContext db) =>
{
    var name = principal.Identity?.Name ?? principal.FindFirstValue(ClaimTypes.Name) ?? "";
    var user = await db.Users.AsNoTracking().SingleOrDefaultAsync(u => u.Username == name);
    if (user is null) return Results.NotFound();
    return Results.Ok(new { user.Id, user.Username, user.Name, user.Address, user.PhoneNumber, user.CreatedAt });
})
.RequireAuthorization()
.WithTags("Demo");


app.MapGet("", () => Results.Ok(new { message = "The api is running" }))
   .WithName("Hello")
   .Produces(StatusCodes.Status200OK);

app.Run();

record RegisterDto(string Username, string Password, string? Name, string? Address, string? PhoneNumber);
record LoginDto(string Username, string Password);





