// DTOs/ScheduleMatchDto.cs
namespace Scoreboard.Models.DTOs
{
    public class ScheduleMatchDto
    {
        public int HomeTeamId { get; set; }
        public int AwayTeamId { get; set; }
        public DateTime DateMatchUtc { get; set; }           // <- dateMatchUtc
        public int QuarterDurationSeconds { get; set; } = 600;

        public List<int> HomeRosterPlayerIds { get; set; } = []; // <- homeRosterPlayerIds
        public List<int> AwayRosterPlayerIds { get; set; } = []; // <- awayRosterPlayerIds
    }
}
