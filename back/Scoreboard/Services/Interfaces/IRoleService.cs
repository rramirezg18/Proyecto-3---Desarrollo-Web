using Scoreboard.Models.DTOs;

namespace Scoreboard.Services.Interfaces
{
    public interface IRoleService
    {
        Task<RoleReadDto> CreateRoleAsync(RoleCreateDto dto);
        Task<IEnumerable<RoleReadDto>> GetAllRolesAsync();
        Task<RoleReadDto?> GetRoleByIdAsync(int id);
        Task<RoleReadDto?> UpdateRoleAsync(int id, RoleUpdateDto dto);
        Task<bool> DeleteRoleAsync(int id);
    }
}
