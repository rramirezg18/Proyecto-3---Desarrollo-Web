using Scoreboard.Models.Entities;
using Scoreboard.Repositories.Interfaces;
using Scoreboard.Infrastructure;
using Microsoft.EntityFrameworkCore;

namespace Scoreboard.Repositories
{
    public class RoleRepository(AppDbContext context) : IRoleRepository
    {
        private readonly AppDbContext _context = context;

        public async Task<Role> AddRoleAsync(Role role)
        {
            _context.Roles.Add(role);
            await _context.SaveChangesAsync();
            return role;
        }

        public async Task<IEnumerable<Role>> GetAllRolesAsync()
        {
            return await _context.Roles.OrderBy(r => r.Id).ToListAsync();
        }

        public async Task<Role?> GetRoleByIdAsync(int id)
        {
            return await _context.Roles.FindAsync(id);
        }

        public async Task<Role?> UpdateRoleAsync(Role role)
        {
            var existing = await _context.Roles.FindAsync(role.Id);
            if (existing == null) return null;

            existing.Name = role.Name;
            existing.UpdatedBy = role.UpdatedBy;
            existing.UpdatedAt = DateTime.UtcNow;

            await _context.SaveChangesAsync();
            return existing;
        }

        public async Task<bool> DeleteRoleAsync(int id)
        {
            var entity = await _context.Roles.FindAsync(id);
            if (entity == null) return false;

            _context.Roles.Remove(entity);
            await _context.SaveChangesAsync();
            return true;
        }
    }
}
