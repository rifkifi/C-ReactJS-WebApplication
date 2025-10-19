using Backend.Data;
using Backend.Models;
using Backend.Dtos;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace Backend.Controllers;

[ApiController]
[Route("api/[controller]")]
public class RestaurantTypesController : ControllerBase
{
    private readonly AppDbContext _db;
    public RestaurantTypesController(AppDbContext db)
    {
        _db = db;
    }

    [HttpGet]
    [AllowAnonymous]
    [ProducesResponseType(typeof(IEnumerable<RestaurantTypeResponse>), StatusCodes.Status200OK)]
    public async Task<IActionResult> GetRestaurantTypes()
    {
        var query = _db.RestaurantTypes.AsNoTracking();
        var items = await query
            .OrderBy(x => x.Name)
            .Select(x => new RestaurantTypeResponse(
                x.Id,
                x.Code,
                x.Name,
                x.Description,
                x.CreatedAt
            ))
            .ToListAsync();
        Console.WriteLine(items);
        return Ok(items);
    }

    [HttpGet("{id:guid}")]
    [AllowAnonymous]
    [ProducesResponseType(typeof(RestaurantTypeResponse), StatusCodes.Status200OK)]
    public async Task<IActionResult> GetRestaurantType(Guid id)
    {
        var item = await _db.RestaurantTypes
            .AsNoTracking()
            .Where(x => x.Id == id)
            .Select(x => new RestaurantTypeResponse(
                x.Id,
                x.Code,
                x.Name,
                x.Description,
                x.CreatedAt
            ))
            .SingleOrDefaultAsync();
        if (item is null) return NotFound();
        return Ok(item);
    }

    [HttpPost("create")]
    [Authorize(Roles = "admin")]
    [ProducesResponseType(typeof(RestaurantTypeResponse), StatusCodes.Status201Created)]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    [ProducesResponseType(StatusCodes.Status409Conflict)]
    public async Task<IActionResult> CreateRestaurantType([FromBody] CreateRestaurantTypeRequest req)
    {
        if (string.IsNullOrWhiteSpace(req.Code) || string.IsNullOrWhiteSpace(req.Name))
            return BadRequest(new { error = "Code and Name are required" });

        var codeExists = await _db.RestaurantTypes.AnyAsync(t => t.Code == req.Code.Trim());
        if (codeExists) return Conflict(new { error = "Code already exists" });

        var entity = new RestaurantType
        {
            Id = Guid.NewGuid(),
            Code = req.Code.Trim(),
            Name = req.Name.Trim(),
            Description = req.Description,
            CreatedAt = DateTime.UtcNow
        };
        _db.RestaurantTypes.Add(entity);
        await _db.SaveChangesAsync();
        var res = new RestaurantTypeResponse(entity.Id, entity.Code, entity.Name, entity.Description, entity.CreatedAt);
        return CreatedAtAction(nameof(GetRestaurantType), new { id = entity.Id }, res);
    }

    [HttpPut("{id:guid}")]
    [Authorize]
    [ProducesResponseType(StatusCodes.Status204NoContent)]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    public async Task<IActionResult> UpdateRestaurantType(Guid id, [FromBody] UpdateRestaurantTypeRequest req)
    {
        if (string.IsNullOrWhiteSpace(req.Code) || string.IsNullOrWhiteSpace(req.Name))
            return BadRequest(new { error = "Code and Name are required" });

        var entity = await _db.RestaurantTypes.FirstOrDefaultAsync(x => x.Id == id);
        if (entity is null) return NotFound();

        entity.Code = req.Code.Trim();
        entity.Name = req.Name.Trim();
        entity.Description = req.Description;
        await _db.SaveChangesAsync();

        return NoContent();
    }
    
    [HttpDelete("{id:guid}")]
    [Authorize(Roles = "admin")]
    [ProducesResponseType(StatusCodes.Status204NoContent)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    public async Task<IActionResult> DeleteRestaurantType(Guid id)
    {
        var entity = await _db.RestaurantTypes.FirstOrDefaultAsync(x => x.Id == id);
        if (entity is null) return NotFound();
        _db.RestaurantTypes.Remove(entity);
        await _db.SaveChangesAsync();
        
        return NoContent();
    }

}
