// MatchesDtos.cs
using System;
using System.Collections.Generic;

namespace Scoreboard.Models.DTOs
{
    // Ya existentes
    public record NewGameDto(string HomeName, string AwayName, int? QuarterDurationSeconds);
    public record NewGameByTeamsDto(int HomeTeamId, int AwayTeamId, int? QuarterDurationSeconds);

    // 👇 NEW: para finalizar un partido desde Control
    public record ScoreEventItem(int TeamId, int? PlayerId, int Points, DateTime DateRegister);
    public record FoulItem(int TeamId, int? PlayerId, DateTime DateRegister);

    public record FinishMatchDto(
        int HomeScore,
        int AwayScore,
        int HomeFouls,
        int AwayFouls,
        List<ScoreEventItem>? ScoreEvents,
        List<FoulItem>? Fouls
    );
}
