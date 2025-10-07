namespace AuthService.Dtos
{
    public class RegisterDto
    {
        public string Email { get; set; } = string.Empty;
        public string Password { get; set; } = string.Empty;

        // Si Proyecto 2 manejaba roles en el alta:
        public string? Role { get; set; }  // opcional, por defecto "User"
    }
}
