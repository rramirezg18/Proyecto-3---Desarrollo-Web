using Scoreboard.Models.Entities;

namespace Scoreboard.Repositories.Interfaces
{
    public interface IMenuRepository
    {
        Task<List<Menu>> GetAllAsync();
        Task<List<Menu>> GetByRoleIdAsync(int roleId);
        Task AssignToRoleAsync(int roleId, IEnumerable<int> menuIds);
    }
}
