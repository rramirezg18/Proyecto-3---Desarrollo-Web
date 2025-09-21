using Scoreboard.Models.DTOs;
using Scoreboard.Repositories.Interfaces;
using Scoreboard.Services.Interfaces;   // 👈 importante

namespace Scoreboard.Services
{
    public class MenuService : IMenuService
    {
        private readonly IMenuRepository _menus;
        private readonly IUserRepository _users;

        public MenuService(IMenuRepository menus, IUserRepository users)
        {
            _menus = menus;
            _users = users;
        }

        public async Task<List<MenuDto>> GetAllAsync() =>
            (await _menus.GetAllAsync())
                .Select(m => new MenuDto { Id = m.Id, Name = m.Name, Url = m.Url })
                .ToList();

        public async Task<List<MenuDto>> GetByRoleIdAsync(int roleId) =>
            (await _menus.GetByRoleIdAsync(roleId))
                .Select(m => new MenuDto { Id = m.Id, Name = m.Name, Url = m.Url })
                .ToList();

        public Task AssignToRoleAsync(int roleId, List<int> menuIds) =>
            _menus.AssignToRoleAsync(roleId, menuIds);

        public async Task<List<MenuDto>> GetMyMenusAsync(int userId)
        {
            var user = await _users.GetByIdWithRoleAsync(userId); // asegúrate de tener este método
            if (user == null) return [];
            return await GetByRoleIdAsync(user.RoleId);
        }
    }
}
