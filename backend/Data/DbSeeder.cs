using Backend.Models;
using Microsoft.EntityFrameworkCore;

namespace Backend.Data;

public static class DbSeeder
{
    public static async Task SeedAsync(AppDbContext db)
    {
        var seedTypes = new List<RestaurantType>
        {
            new RestaurantType { Id = Guid.NewGuid(), Code = "CF1", Name = "Cafe", Description = "Coffee & light bites", CreatedAt = DateTime.UtcNow },
            new RestaurantType { Id = Guid.NewGuid(), Code = "CN1", Name = "Chinese", Description = "Regional Chinese cuisines from Sichuan to Cantonese", CreatedAt = DateTime.UtcNow },
            new RestaurantType { Id = Guid.NewGuid(), Code = "IN1", Name = "Indonesian", Description = "Authentic Indonesian", CreatedAt = DateTime.UtcNow },
            new RestaurantType { Id = Guid.NewGuid(), Code = "IT1", Name = "Italian", Description = "Pasta, pizza, and classic Italian dishes", CreatedAt = DateTime.UtcNow },
            new RestaurantType { Id = Guid.NewGuid(), Code = "JP1", Name = "Japanese", Description = "Authentic Japanese cuisine including sushi, ramen, and more", CreatedAt = DateTime.UtcNow },
            new RestaurantType { Id = Guid.NewGuid(), Code = "MX1", Name = "Mexican", Description = "Tacos, burritos, salsas, and more", CreatedAt = DateTime.UtcNow },
            new RestaurantType { Id = Guid.NewGuid(), Code = "SF1", Name = "Seafood", Description = "Seafood places", CreatedAt = DateTime.UtcNow },
            new RestaurantType { Id = Guid.NewGuid(), Code = "TH1", Name = "Thai", Description = "Spicy curries, noodles, and street food", CreatedAt = DateTime.UtcNow },
            new RestaurantType { Id = Guid.NewGuid(), Code = "VG1", Name = "Vegan", Description = "Plant-based eateries", CreatedAt = DateTime.UtcNow }
        };

        foreach (var t in seedTypes)
        {
            var exists = await db.RestaurantTypes.AnyAsync(x => x.Id == t.Id || x.Code == t.Code);
            if (!exists)
            {
                db.RestaurantTypes.Add(t);
            }
        }

        var seedCategories = new List<MenuCategory>
        {
            new MenuCategory { Id = Guid.NewGuid(), Name = "Appetizer", Description = "Starters and small dishes served before the main course", CreatedAt = DateTime.UtcNow },
            new MenuCategory { Id = Guid.NewGuid(), Name = "Dessert", Description = "Sweet treats and after-meal dishes", CreatedAt = DateTime.UtcNow },
            new MenuCategory { Id = Guid.NewGuid(), Name = "Drink", Description = "Beverages, juices, sodas, teas, and coffee", CreatedAt = DateTime.UtcNow },
            new MenuCategory { Id = Guid.NewGuid(), Name = "Main Course", Description = "Hearty dishes that are the centerpiece of the meal", CreatedAt = DateTime.UtcNow },
            new MenuCategory { Id = Guid.NewGuid(), Name = "Side Dish", Description = "Complementary dishes served alongside the main course", CreatedAt = DateTime.UtcNow },
            new MenuCategory { Id = Guid.NewGuid(), Name = "Special", Description = "Limited-time or chef’s special menu items", CreatedAt = DateTime.UtcNow }
        };

        foreach (var c in seedCategories)
        {
            var exists = await db.MenuCategories.AnyAsync(x => x.Name == c.Name);
            if (!exists)
            {
                db.MenuCategories.Add(c);
            }
        }

        if (!await db.Users.AnyAsync(u => u.Username == "admin"))
        {
            var admin = new User
            {
                Id = Guid.NewGuid(),
                Username = "admin",
                PasswordHash = BCrypt.Net.BCrypt.HashPassword("121212"),
                Name = "Administrator",
                CreatedAt = DateTime.UtcNow,
                Roles = new[] { "admin" }
            };
            db.Users.Add(admin);
        }

        await db.SaveChangesAsync();

        if (!await db.Restaurants.AnyAsync())
        {
            var owner = await db.Users.FirstAsync(u => u.Username == "admin");
            var type = await db.RestaurantTypes.FirstAsync();
            var restaurantId = Guid.NewGuid();

            var restaurant = new Restaurant
            {
                Id = restaurantId,
                Name = "Sample Restaurant",
                Address = "123 Main St",
                OwnerId = owner.Id,
                RestaurantTypeId = type.Id,
                Phone = "+1-555-1234",
                OpeningHours = "09:00-21:00",
                ImageUrl = "https://virtuzone.com/wp-content/uploads/2024/04/restaurant-business-plan-template.jpg",
                Description = "Welcome to Sample Restaurant",
                IsActive = true,
                CreatedAt = DateTime.UtcNow
            };
            db.Restaurants.Add(restaurant);
            await db.SaveChangesAsync();

            var category = await db.MenuCategories.FirstAsync();
            var menu = new Menu
            {
                Id = Guid.NewGuid(),
                Name = "Sample Dish",
                Description = "Tasty meal",
                Price = 9.99m,
                RestaurantId = restaurantId,
                CategoryId = category.Id,
                ImageUrl = "https://radarmukomuko.bacakoran.co/upload/850af79a37c129e270718a4d3283b922.jpg",
                CreatedAt = DateTime.UtcNow
            };
            db.Menus.Add(menu);
            await db.SaveChangesAsync();
        }
    }
}
