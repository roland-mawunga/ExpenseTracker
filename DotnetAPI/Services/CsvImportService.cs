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

        // Build the lookup once
        var categoryLookup = categories
            .Select(c => new CategoryLookup
            {
                Id = c.Id,
                Keywords = c.Keywords
                    .Split(',', StringSplitOptions.RemoveEmptyEntries)
                    .Select(k => k.Trim())
                    .ToList()
            })
            .ToList();

        var config = new CsvConfiguration(CultureInfo.InvariantCulture)
        {
            HasHeaderRecord = true,
            MissingFieldFound = null,
            BadDataFound = null,
            TrimOptions = TrimOptions.Trim
        };

        using var reader = new StreamReader(csvStream);
        using var csv = new CsvReader(reader, config);

        var transactions = new List<Transaction>();

        var records = csv.GetRecords<CsvTransaction>();

        foreach (var record in records)
        {
            if (string.IsNullOrWhiteSpace(record.Description))
                continue;

            var amount = ParseAmount(record.Amount);

            transactions.Add(new Transaction
            {
                Date = ParseDate(record.Date),
                Description = record.Description,
                Amount = Math.Abs(amount),
                Type = amount < 0 ? "debit" : "credit",
                CategoryId = MatchCategory(record.Description, categoryLookup),
                ImportedAt = DateTime.UtcNow
            });
        }

        return transactions;
    }

    private int? MatchCategory(
    string description,
    List<CategoryLookup> categories)
    {
        foreach (var category in categories)
        {
            if (category.Keywords.Any(keyword =>
                description.Contains(keyword, StringComparison.OrdinalIgnoreCase)))
            {
                return category.Id;
            }
        }

        return null;
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