using System.ComponentModel.DataAnnotations;

namespace Scoreboard.Models.Entities;

    public class Role
    {
    public int Id { get; set; }
    [Required]
    public required string Name { get; set; }
    public DateTime CreatedAt { get; set; } = DateTime.Now;
    public int CreatedBy { get; set; }
    public DateTime? UpdatedAt { get; set; }
    public int UpdatedBy { get; set; }
    public ICollection<User> Users { get; set; } = [];

    }
