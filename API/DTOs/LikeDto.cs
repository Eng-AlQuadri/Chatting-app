namespace API.DTOs
{
    public class LikeDto
    {
        public int Id { get; set; }
        public string UserName { get; set; } = null!;
        public int Age { get; set; }
        public string? KnownAs { get; set; }
        public string? PhotoUrl { get; set; }
        public string? City { get; set; }
    }
}