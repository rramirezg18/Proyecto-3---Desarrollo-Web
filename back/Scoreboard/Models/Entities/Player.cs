namespace Scoreboard.Models.Entities;

public class Player
{
    public int Id { get; set; }
    public int? Number { get; set; }
    public string Name { get; set; } = string.Empty;
    public int TeamId { get; set; }

    // 🔗 relación
    public Team? Team { get; set; }
}
