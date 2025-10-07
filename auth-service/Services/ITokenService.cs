using AuthService.Models;

namespace AuthService.Services
{
    public interface ITokenService
    {
        string CreateAccessToken(User user, int minutes, string issuer, string audience, string key);
        string CreateRefreshToken(int size = 64);
    }
}
