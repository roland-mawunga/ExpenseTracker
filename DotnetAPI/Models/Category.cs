namespace DotnetAPI.Models;

public class Category
{
    public int Id { get; set; }
    public string Name { get; set; } = string.Empty;
    public string Keywords { get; set; } = string.Empty;
    public string Color { get; set; } = string.Empty;  // hex, e.g. "#4CAF50" for frontend badges
}