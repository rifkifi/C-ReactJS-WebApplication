using System.Text.Json.Serialization;

namespace Backend.Models;

public class MenuCategory
{
    public Guid Id { get; set; }
    public string Name { get; set; } = default!;
    public string? Description { get; set; }
    public DateTime CreatedAt { get; set; }
    [JsonIgnore]
    public ICollection<Menu> Menus { get; set; } = new HashSet<Menu>();
}