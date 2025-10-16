namespace Backend.Dtos;

public sealed record UserResponse(
    Guid Id,
    string Username,
    string? Name,
    string? Address,
    string? PhoneNumber,
    DateTime CreatedAt

);
