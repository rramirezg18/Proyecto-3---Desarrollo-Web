using Microsoft.EntityFrameworkCore;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.IdentityModel.Tokens;
using System.Text;

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
builder.Services.AddScoped<IUserRepository, UserRepository>();
builder.Services.AddScoped<IAuthService, AuthService>();
builder.Services.AddScoped<IMenuRepository, MenuRepository>();
builder.Services.AddScoped<IMenuService, MenuService>();

// 6) 🔑 Configuración JWT
var jwtSettings = builder.Configuration.GetSection("Jwt");
var keyBytes = Encoding.UTF8.GetBytes(jwtSettings["Key"] ?? "SuperSecretKey123!");

builder.Services.AddAuthentication(options =>
{
    options.DefaultAuthenticateScheme = JwtBearerDefaults.AuthenticationScheme;
    options.DefaultChallengeScheme = JwtBearerDefaults.AuthenticationScheme;
})
.AddJwtBearer(options =>
{
    options.RequireHttpsMetadata = false;
    options.SaveToken = true;
    options.TokenValidationParameters = new TokenValidationParameters
    {
        ValidateIssuer = false,
        ValidateAudience = false,
        ValidateLifetime = true,
        ValidateIssuerSigningKey = true,
        ValidIssuer = jwtSettings["Issuer"],
        ValidAudience = jwtSettings["Audience"],
        IssuerSigningKey = new SymmetricSecurityKey(keyBytes)
    };
});

builder.Services.AddAuthorization();

var app = builder.Build();

if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
    app.UseCors("DevCors");
}

app.UseDefaultFiles();
app.UseStaticFiles();

app.UseAuthentication(); // 👈 importante: antes de Authorization
app.UseAuthorization();



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
