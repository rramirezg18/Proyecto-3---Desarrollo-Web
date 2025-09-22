namespace Scoreboard.Models.DTOs
{
    public class ScheduleMatchDto
    {
        public int HomeTeamId { get; set; }
        public int AwayTeamId { get; set; }
        /// <summary>
        /// Fecha/hora del partido en UTC. Ej: 2025-09-30T20:00:00Z
        /// </summary>
        public DateTime DateMatchUtc { get; set; }
        public int? QuarterDurationSeconds { get; set; } = 600;
    }
}
