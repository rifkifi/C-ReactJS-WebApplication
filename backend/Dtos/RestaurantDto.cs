using Backend.Models;

namespace Backend.Dtos;

public sealed record CreateRestaurantRequest(
    string Name,
    string Address,
    string? Phone = null,
    string? OpeningHours = null,
    string? ImageUrl = null,
    bool IsActive = true,
    string? Description = null,
    Guid? RestaurantTypeId = null
);

public sealed record UpdateRestaurantRequest(
    string Name,
    string Address,
    Guid RestaurantTypeId,
    string? Phone,
    string? OpeningHours,
    string? ImageUrl,
    string? Description,
    bool IsActive
);

public sealed record RestaurantResponse(
    Guid Id,
    string Name,
    string Address,
    Guid? RestaurantTypeId,
    string? Phone,
    string? OpeningHours,
    string? ImageUrl,
    string? Description,
    bool IsActive,
    decimal? Rating,
    int RatingCount,
    DateTime CreatedAt
);
