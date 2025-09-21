namespace Scoreboard.Services.Interfaces
{
    using Scoreboard.Models.DTOs;

    public interface IMenuService
    {
        Task<List<MenuDto>> GetAllAsync();
        Task<List<MenuDto>> GetByRoleIdAsync(int roleId);
        Task AssignToRoleAsync(int roleId, List<int> menuIds);
        Task<List<MenuDto>> GetMyMenusAsync(int userId);
    }
}
