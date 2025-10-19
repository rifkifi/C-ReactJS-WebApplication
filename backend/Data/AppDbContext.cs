using Backend.Models;
using Microsoft.EntityFrameworkCore;

namespace Backend.Data;

public class AppDbContext(DbContextOptions<AppDbContext> options) : DbContext(options)
{
    public DbSet<User> Users => Set<User>();
    public DbSet<Menu> Menus => Set<Menu>();
    public DbSet<Restaurant> Restaurants => Set<Restaurant>();
    public DbSet<MenuCategory> MenuCategories => Set<MenuCategory>();
    public DbSet<RestaurantType> RestaurantTypes => Set<RestaurantType>();

    protected override void OnModelCreating(ModelBuilder b)
    {
        b.Entity<User>(e =>
        {
            e.HasKey(x => x.Id);
            e.HasIndex(x => x.Username).IsUnique();
            e.Property(x => x.Username).HasMaxLength(100).IsRequired();
            e.Property(x => x.PasswordHash).HasMaxLength(200).IsRequired();
            e.Property(x => x.Name).HasMaxLength(100);
            e.Property(x => x.Address).HasMaxLength(300);
            e.Property(x => x.PhoneNumber).HasMaxLength(20);
            e.Property(x => x.Roles).HasMaxLength(50).HasColumnType("text[]");
            e.Property(x => x.CreatedAt).HasColumnType("timestamp with time zone"); ;
        });

        b.Entity<Restaurant>(e =>
        {
            e.HasKey(x => x.Id);
            e.Property(x => x.Name).HasMaxLength(100).IsRequired();
            e.Property(x => x.Address).HasMaxLength(300).IsRequired();
            e.Property(x => x.Phone).HasMaxLength(20);
            e.Property(x => x.OpeningHours).HasMaxLength(20);
            e.Property(x => x.ImageUrl).HasMaxLength(500);
            e.Property(x => x.IsActive);
            e.Property(x => x.Description).HasMaxLength(500);
            e.Property(x => x.Rating).HasColumnType("numeric(3,2)");
            e.Property(x => x.RatingCount).HasDefaultValue(0);
            e.Property(x => x.CreatedAt).HasColumnType("timestamp with time zone"); ;

            e.HasIndex(x => x.Name);
            e.HasIndex(x => x.RestaurantTypeId);
            e.HasIndex(x => x.OwnerId);

            e.HasMany(x => x.Menus)
                .WithOne(m => m.Restaurant)
                .HasForeignKey(m => m.RestaurantId)
                .OnDelete(DeleteBehavior.Cascade);

            e.HasOne(x => x.Type)
                .WithMany(x => x.Restaurants)
                .HasForeignKey(x => x.RestaurantTypeId)
                .OnDelete(DeleteBehavior.Restrict);


        });

        b.Entity<Menu>(e =>
        {
            e.HasKey(x => x.Id);
            e.Property(x => x.Name).HasMaxLength(100).IsRequired();
            e.Property(x => x.Description).HasMaxLength(500);
            e.Property(x => x.Price).HasColumnType("numeric(10,2)");
            e.Property(x => x.RatingCount).HasDefaultValue(0);
            e.Property(x => x.ImageUrl).HasMaxLength(500);
            e.Property(x => x.CreatedAt).HasColumnType("timestamp with time zone"); ;

            e.HasIndex(x => x.RestaurantId);
            e.HasIndex(x => x.CategoryId);

            e.HasOne(x => x.Restaurant)
                .WithMany(x => x.Menus)
                .HasForeignKey(x => x.RestaurantId)
                .OnDelete(DeleteBehavior.Cascade);

            e.HasOne(x => x.Category)
                .WithMany(x => x.Menus)
                .HasForeignKey(x => x.CategoryId)
                .OnDelete(DeleteBehavior.Restrict);
        });

        b.Entity<MenuCategory>(e =>
        {
            e.HasKey(x => x.Id);
            e.Property(x => x.Name).HasMaxLength(100).IsRequired();
            e.Property(x => x.Description).HasMaxLength(500);
            e.Property(x => x.CreatedAt).HasColumnType("timestamp with time zone");

            e.HasMany(c => c.Menus)
                .WithOne(m => m.Category)
                .HasForeignKey(m => m.CategoryId)
                .OnDelete(DeleteBehavior.Restrict);
        });

        b.Entity<RestaurantType>(e =>
        {
            e.HasKey(x => x.Id);
            e.Property(x => x.Code).HasMaxLength(6).IsRequired();
            e.Property(x => x.Name).HasMaxLength(100).IsRequired();
            e.Property(x => x.Description).HasMaxLength(250);
            e.Property(x => x.CreatedAt).HasColumnType("timestamp with time zone");
            e.HasIndex(x => x.Code).IsUnique();

            e.HasMany(x => x.Restaurants)
                .WithOne(r => r.Type)
                .HasForeignKey(r => r.RestaurantTypeId)
                .OnDelete(DeleteBehavior.Restrict);
        });
    }
}
