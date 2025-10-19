using System.Collections.Generic;

namespace Backend.Dtos;

public sealed record ApiResponse<T>(
    T? Data,
    bool Success = true,
    string? Message = null
);