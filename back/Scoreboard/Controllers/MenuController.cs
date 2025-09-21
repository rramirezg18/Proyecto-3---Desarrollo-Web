using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Scoreboard.Models.DTOs;
using Scoreboard.Services.Interfaces;
using System.Security.Claims;

namespace Scoreboard.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    [Authorize]
    public class MenuController(IMenuService service) : ControllerBase
    {
        private readonly IMenuService _service = service;

        // Todos los menús (opcional solo Admin)
        [HttpGet]
        [Authorize(Roles = "Admin")]
        public async Task<IActionResult> GetAll() => Ok(await _service.GetAllAsync());

        // Menús por rol (admin)
        [HttpGet("role/{roleId:int}")]
        [Authorize(Roles = "Admin")]
        public async Task<IActionResult> GetByRoleId(int roleId) =>
            Ok(await _service.GetByRoleIdAsync(roleId));

        // Asignar menús a rol (admin)
        [HttpPost("role/{roleId:int}")]
        [Authorize(Roles = "Admin")]
        public async Task<IActionResult> AssignToRole(int roleId, [FromBody] AssignMenusDto dto)
        {
            await _service.AssignToRoleAsync(roleId, dto.MenuIds);
            return NoContent();
        }

        // Mis menús (según token)
        [HttpGet("mine")]
        public async Task<IActionResult> MyMenus()
        {
            var idClaim = User.FindFirstValue("Id");               // si guardaste "Id" como claim string
            if (string.IsNullOrEmpty(idClaim)) return Unauthorized();
            var userId = int.Parse(idClaim);
            var menus = await _service.GetMyMenusAsync(userId);
            return Ok(menus);
        }
    }
}
