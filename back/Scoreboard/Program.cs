using Microsoft.EntityFrameworkCore;
using Scoreboard.Infrastructure;
using Scoreboard.Hubs;

// 👇 importa namespaces de repos y services
using Scoreboard.Repositories;
using Scoreboard.Repositories.Interfaces;
using Scoreboard.Services;
using Scoreboard.Services.Interfaces;

using TeamEntity  = Scoreboard.Models.Entities.Team;
using MatchEntity = Scoreboard.Models.Entities.Match;

var builder = WebApplication.CreateBuilder(args);

// 1) Controllers + Swagger
builder.Services.AddControllers();
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

// 2) EF Core
builder.Services.AddDbContext<AppDbContext>(opt =>
    opt.UseSqlServer(builder.Configuration.GetConnectionString("DefaultConnection")));

builder.Services.AddSignalR();

// 3) CORS Angular dev server
builder.Services.AddCors(options =>
{
    options.AddPolicy("DevCors", policy =>
    {
        policy.WithOrigins("http://localhost:4200", "http://127.0.0.1:4200")
              .AllowAnyHeader()
              .AllowAnyMethod()
              .AllowCredentials();
    });
});

// 4) Runtime del reloj en memoria
builder.Services.AddSingleton<IMatchRunTime, MatchRunTime>();

// 5) 👇 Registro de dependencias de tus repos y servicios
builder.Services.AddScoped<IRoleRepository, RoleRepository>();
builder.Services.AddScoped<IRoleService, RoleService>();

// (cuando tengas más: IUserRepository, IUserService, etc. los registras aquí igual)

var app = builder.Build();

if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
    app.UseCors("DevCors");
}

app.UseDefaultFiles();
app.UseStaticFiles();

app.MapControllers();
app.MapHub<ScoreHub>("/hubs/score");
app.MapFallbackToFile("/index.html");

// Migraciones + seed
using (var scope = app.Services.CreateScope())
{
    var db = scope.ServiceProvider.GetRequiredService<AppDbContext>();
    db.Database.Migrate();

    if (!db.Teams.Any())
    {
        var home = new TeamEntity { Name = "Locales", Color = "#0044FF" };
        var away = new TeamEntity { Name = "Visitantes", Color = "#FF3300" };
        db.AddRange(home, away);
        await db.SaveChangesAsync();

        db.Set<MatchEntity>().Add(new MatchEntity
        {
            HomeTeamId = home.Id,
            AwayTeamId = away.Id,
            Status = "Scheduled",
            QuarterDurationSeconds = 600,
            HomeScore = 0,
            AwayScore = 0,
            Period = 1,
            DateMatch = DateTime.Now
        });
        await db.SaveChangesAsync();
    }
}

app.Run();
