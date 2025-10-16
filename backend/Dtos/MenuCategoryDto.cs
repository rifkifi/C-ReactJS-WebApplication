namespace Backend.Dtos;

public sealed record MenuCategoryResponse
(
    Guid Id,
    string Name,
    string? Description,
    DateTime CreatedAt
);

public sealed record CreateMenuCategoryRequest
(
    string Name,
    string? Description
);

public sealed record UpdateMenuCategoryRequest
(
    string Name,
    string? Description
);