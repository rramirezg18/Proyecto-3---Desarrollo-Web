namespace Scoreboard.Models.Entities
{
    public class Menu
    {
        public int Id { get; set; }
        public required string Name { get; set; }
        public required string Url { get; set; }

        public ICollection<RoleMenu> RoleMenus { get; set; } = [];
    }
}
