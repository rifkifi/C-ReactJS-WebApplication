namespace Backend.Dtos;

public sealed record LoginDto(string Username, string Password);

public sealed record RegisterDto(
    string Username,
    string Password,
    string? Name,
    string? Address,
    string? PhoneNumber,
    string[]? Roles
);

public sealed record LogoutDto(string Token);