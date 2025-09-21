using Microsoft.EntityFrameworkCore;
using Scoreboard.Infrastructure;
using Scoreboard.Models.Entities;
using Scoreboard.Repositories.Interfaces;

namespace Scoreboard.Repositories
{
    public class MenuRepository(AppDbContext db) : IMenuRepository
    {
        private readonly AppDbContext _db = db;

        public Task<List<Menu>> GetAllAsync() =>
            _db.Menus.OrderBy(m => m.Name).ToListAsync();

        public async Task<List<Menu>> GetByRoleIdAsync(int roleId)
        {
            return await _db.RoleMenus
                .Where(rm => rm.RoleId == roleId)
                .Select(rm => rm.Menu!)
                .OrderBy(m => m.Name)
                .ToListAsync();
        }

        public async Task AssignToRoleAsync(int roleId, IEnumerable<int> menuIds)
        {
            var current = await _db.RoleMenus.Where(rm => rm.RoleId == roleId).ToListAsync();
            _db.RoleMenus.RemoveRange(current);

            var toAdd = menuIds.Distinct().Select(mid => new RoleMenu { RoleId = roleId, MenuId = mid });
            await _db.RoleMenus.AddRangeAsync(toAdd);
            await _db.SaveChangesAsync();
        }
    }
}
