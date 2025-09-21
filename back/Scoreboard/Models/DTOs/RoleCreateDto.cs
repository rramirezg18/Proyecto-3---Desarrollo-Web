namespace Scoreboard.Models.DTOs
{
    public class RoleCreateDto
    {
        public string Name { get; set; } = string.Empty;
        public int CreatedBy { get; set; }
    }
}
