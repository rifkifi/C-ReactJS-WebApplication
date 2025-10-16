using System.Text.Json.Serialization;

namespace Backend.Models;

public class Menu
{
    public Guid Id { get; set; }
    public string Name { get; set; } = default!;
    public string? Description { get; set; }
    public decimal Price { get; set; }
    public bool IsActive { get; set; } = true;
    public Guid RestaurantId { get; set; }
    [JsonIgnore]
    public Restaurant Restaurant { get; set; } = default!;
    public Guid CategoryId { get; set; }
    [JsonIgnore]
    public MenuCategory Category { get; set; } = default!;
    public decimal? Rating { get; set; }
    public int RatingCount { get; set; } = 0;
    public string? ImageUrl { get; set; }
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
}
