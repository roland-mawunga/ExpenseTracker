namespace DotnetAPI.Models;

public class Transaction
{
    public int Id { get; set; }
    public DateTime Date { get; set; }
    public string Description { get; set; } = string.Empty;
    public decimal Amount { get; set; }
    public string Type { get; set; } = string.Empty;    // "debit" or "credit"
    public int? CategoryId { get; set; }
    public string? CategoryName { get; set; }           // joined from Categories, avoids extra round trips
    public string? CategoryColor { get; set; }          // same
    public string? Notes { get; set; }                  // user can add a note to any transaction
    public DateTime ImportedAt { get; set; }
}