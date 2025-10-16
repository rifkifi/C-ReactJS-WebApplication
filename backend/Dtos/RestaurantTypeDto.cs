namespace Backend.Dtos;

public sealed record RestaurantTypeResponse(
    Guid Id,
    string Code,
    string Name,
    string? Description,
    DateTime CreatedAt
);

public sealed record CreateRestaurantTypeRequest(
    string Code,
    string Name,
    string? Description
);

public sealed record UpdateRestaurantTypeRequest(
    string Code,
    string? Name,
    string? Description
);
