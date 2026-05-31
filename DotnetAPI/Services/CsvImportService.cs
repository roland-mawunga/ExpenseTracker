using CsvHelper;
using CsvHelper.Configuration;
using System.Globalization;
using DotnetAPI.Models;
using DotnetAPI.Repositories;

namespace DotnetAPI.Services;

public class CsvImportService
{
    private readonly CategoryRepository _categoryRepository;

    public CsvImportService(CategoryRepository categoryRepository)
    {
        _categoryRepository = categoryRepository;
    }

    public IEnumerable<Transaction> ParseAndCategorize(Stream csvStream)
    {
        var categories = _categoryRepository.GetAll().ToList();

        var config = new CsvConfiguration(CultureInfo.InvariantCulture)
        {
            HasHeaderRecord = true,
            MissingFieldFound = null,       // don't throw if a column is missing
            BadDataFound = null,            // skip malformed rows
            TrimOptions = TrimOptions.Trim  // trim whitespace from fields
        };

        using var reader = new StreamReader(csvStream);
        using var csv = new CsvReader(reader, config);

        var transactions = new List<Transaction>();

        csv.Read();
        csv.ReadHeader();

        while (csv.Read())
        {
            var description = csv.GetField<string>("Description") ?? string.Empty;
            var amountStr   = csv.GetField<string>("Amount") ?? "0";
            var dateStr     = csv.GetField<string>("Date") ?? string.Empty;

            if (string.IsNullOrWhiteSpace(description)) continue;

            var amount = ParseAmount(amountStr);

            var transaction = new Transaction
            {
                Date        = ParseDate(dateStr),
                Description = description,
                Amount      = Math.Abs(amount),
                Type        = amount < 0 ? "debit" : "credit",
                CategoryId  = MatchCategory(description, categories),
                ImportedAt  = DateTime.UtcNow
            };

            transactions.Add(transaction);
        }

        return transactions;
    }

    private int? MatchCategory(string description, List<Category> categories)
    {
        var lower = description.ToLower();

        foreach (var category in categories)
        {
            var keywords = category.Keywords
                .Split(',', StringSplitOptions.RemoveEmptyEntries)
                .Select(k => k.Trim().ToLower());

            if (keywords.Any(k => lower.Contains(k)))
                return category.Id;
        }

        return null; // uncategorized
    }

    private decimal ParseAmount(string value)
    {
        // strip currency symbols, spaces e.g. "R 1 234.56" or "-$500.00"
        var cleaned = System.Text.RegularExpressions.Regex.Replace(value, @"[^\d\.\-]", "");
        return decimal.TryParse(cleaned, NumberStyles.Any, CultureInfo.InvariantCulture, out var result)
            ? result
            : 0;
    }

    private DateTime ParseDate(string value)
    {
        // try common bank date formats
        string[] formats = { "yyyy-MM-dd", "dd/MM/yyyy", "MM/dd/yyyy", "dd-MM-yyyy", "yyyyMMdd" };
        return DateTime.TryParseExact(value.Trim(), formats, CultureInfo.InvariantCulture, DateTimeStyles.None, out var date)
            ? date
            : DateTime.UtcNow;
    }
}