namespace Backend.Models;

public class RestaurantType
{
    public Guid Id { get; set; }
    public string Code { get; set; } = default!;
    public string Name { get; set; } = default!;
    public string? Description { get; set; }
    public ICollection<Restaurant> Restaurants { get; set; } = new HashSet<Restaurant>();
    public DateTime CreatedAt { get; set; }
}