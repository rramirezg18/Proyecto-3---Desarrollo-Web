using Scoreboard.Models.Entities;

namespace Scoreboard.Repositories.Interfaces
{
    public interface IRoleRepository
    {
        Task<Role> AddRoleAsync(Role role);
        Task<IEnumerable<Role>> GetAllRolesAsync();
        Task<Role?> GetRoleByIdAsync(int id);
        Task<Role?> UpdateRoleAsync(Role role);
        Task<bool> DeleteRoleAsync(int id);
    }
}
