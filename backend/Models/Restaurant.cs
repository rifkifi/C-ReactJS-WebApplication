using System.Text.Json.Serialization;

namespace Backend.Models;

public class Restaurant
{
    public Guid Id { get; set; }
    public string Name { get; set; } = default!;
    public string Address { get; set; } = default!;
    public Guid OwnerId { get; set; }
    public string? Phone { get; set; }
    public string? OpeningHours { get; set; }
    public string? ImageUrl { get; set; }
    public bool IsActive { get; set; } = true;
    public string? Description { get; set; }
    public decimal? Rating { get; set; }
    public int RatingCount { get; set; } = 0;
    [JsonIgnore]
    public ICollection<Menu> Menus { get; set; } = new HashSet<Menu>();
    public Guid? RestaurantTypeId { get; set; }
    [JsonIgnore]
    public RestaurantType? Type { get; set; }
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

}