using Microsoft.EntityFrameworkCore;
using Scoreboard.Models.Entities;

// Alias para simplificar
using Team       = Scoreboard.Models.Entities.Team;
using Player     = Scoreboard.Models.Entities.Player;
using Match      = Scoreboard.Models.Entities.Match;
using ScoreEvent = Scoreboard.Models.Entities.ScoreEvent;
using Foul       = Scoreboard.Models.Entities.Foul;
using TeamWin    = Scoreboard.Models.Entities.TeamWin;
using Menu       = Scoreboard.Models.Entities.Menu;
using Role       = Scoreboard.Models.Entities.Role;
using User       = Scoreboard.Models.Entities.User;
using RoleMenu   = Scoreboard.Models.Entities.RoleMenu;

namespace Scoreboard.Infrastructure;

public class AppDbContext(DbContextOptions<AppDbContext> options) : DbContext(options)
{
    public DbSet<Team> Teams => Set<Team>();
    public DbSet<Player> Players => Set<Player>();
    public DbSet<Match> Matches => Set<Match>();
    public DbSet<ScoreEvent> ScoreEvents => Set<ScoreEvent>();
    public DbSet<Foul> Fouls => Set<Foul>();
    public DbSet<TeamWin> TeamWins => Set<TeamWin>();

    public DbSet<User> Users => Set<User>();
    public DbSet<Role> Roles => Set<Role>();
    public DbSet<Menu> Menus => Set<Menu>();
    public DbSet<RoleMenu> RoleMenus => Set<RoleMenu>();

    protected override void OnModelCreating(ModelBuilder b)
    {
        // Team
        b.Entity<Team>()
            .HasIndex(t => t.Name).IsUnique();

        // Player
        b.Entity<Player>()
            .HasOne(p => p.Team).WithMany(t => t.Players)
            .HasForeignKey(p => p.TeamId).OnDelete(DeleteBehavior.Cascade);
        b.Entity<Player>()
            .HasIndex(p => new { p.TeamId, p.Number }).IsUnique()
            .HasFilter("[Number] IS NOT NULL");

        // Match
        b.Entity<Match>()
            .HasOne(m => m.HomeTeam).WithMany()
            .HasForeignKey(m => m.HomeTeamId).OnDelete(DeleteBehavior.NoAction);
        b.Entity<Match>()
            .HasOne(m => m.AwayTeam).WithMany()
            .HasForeignKey(m => m.AwayTeamId).OnDelete(DeleteBehavior.NoAction);
        b.Entity<Match>()
            .HasIndex(m => m.Status);
        b.Entity<Match>()
            .Property(m => m.Status).HasMaxLength(16);

        // ScoreEvent
        b.Entity<ScoreEvent>()
            .HasOne(se => se.Match).WithMany(m => m.ScoreEvents)
            .HasForeignKey(se => se.MatchId).OnDelete(DeleteBehavior.Cascade);
        b.Entity<ScoreEvent>()
            .HasOne(se => se.Team).WithMany()
            .HasForeignKey(se => se.TeamId).OnDelete(DeleteBehavior.NoAction);
        b.Entity<ScoreEvent>()
            .HasOne(se => se.Player).WithMany()
            .HasForeignKey(se => se.PlayerId).OnDelete(DeleteBehavior.NoAction);
        b.Entity<ScoreEvent>()
            .HasIndex(se => se.MatchId);
        b.Entity<ScoreEvent>()
            .HasIndex(se => se.DateRegister);

        // Foul
        b.Entity<Foul>()
            .HasOne(f => f.Match).WithMany()
            .HasForeignKey(f => f.MatchId).OnDelete(DeleteBehavior.Cascade);
        b.Entity<Foul>()
            .HasOne(f => f.Team).WithMany()
            .HasForeignKey(f => f.TeamId).OnDelete(DeleteBehavior.NoAction);
        b.Entity<Foul>()
            .HasOne(f => f.Player).WithMany()
            .HasForeignKey(f => f.PlayerId).OnDelete(DeleteBehavior.NoAction);
        b.Entity<Foul>()
            .HasIndex(f => new { f.MatchId, f.TeamId });

        // TeamWin
        b.Entity<TeamWin>()
            .HasOne(tw => tw.Team).WithMany()
            .HasForeignKey(tw => tw.TeamId).OnDelete(DeleteBehavior.NoAction);
        b.Entity<TeamWin>()
            .HasOne(tw => tw.Match).WithMany()
            .HasForeignKey(tw => tw.MatchId).OnDelete(DeleteBehavior.Cascade);
        b.Entity<TeamWin>()
            .HasIndex(tw => new { tw.TeamId, tw.MatchId }).IsUnique();
        b.Entity<TeamWin>()
            .HasIndex(tw => tw.TeamId);

        // Role → Users
        b.Entity<Role>()
            .HasMany(r => r.Users)
            .WithOne(u => u.Role)
            .HasForeignKey(u => u.RoleId);

        // Menu
        b.Entity<Menu>()
            .HasIndex(m => m.Url).IsUnique();

        // RoleMenu
        b.Entity<RoleMenu>()
            .HasIndex(rm => new { rm.RoleId, rm.MenuId })
            .IsUnique();

        b.Entity<RoleMenu>()
            .HasOne(rm => rm.Role)
            .WithMany(r => r.RoleMenus)
            .HasForeignKey(rm => rm.RoleId)
            .OnDelete(DeleteBehavior.Cascade);

        b.Entity<RoleMenu>()
            .HasOne(rm => rm.Menu)
            .WithMany(m => m.RoleMenus)
            .HasForeignKey(rm => rm.MenuId)
            .OnDelete(DeleteBehavior.Cascade);

        base.OnModelCreating(b);
    }
}
