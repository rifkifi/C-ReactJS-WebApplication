using Backend.Models;

namespace Backend.Dtos;

public sealed record MenuResponse(
    Guid Id,
    string Name,
    string? Description,
    decimal Price,
    Guid RestaurantId,
    Guid CategoryId,
    decimal? Rating,
    string? ImageUrl,
    DateTime CreatedAt,
    bool IsActive = true,
    int RatingCount = 0
);

public sealed record CreateMenuRequest(
    string Name,
    string? Description,
    decimal Price,
    Guid RestaurantId,
    Guid CategoryId,
    string? ImageUrl,
    bool IsActive = true
);

public sealed record UpdateMenuRequest(
    string Name,
    string? Description,
    decimal Price,
    Guid RestaurantId,
    Guid CategoryId,
    string? ImageUrl,
    bool IsActive = true
);