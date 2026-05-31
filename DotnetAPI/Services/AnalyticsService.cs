using DotnetAPI.Models;
using DotnetAPI.Repositories;

namespace DotnetAPI.Services;

public class AnalyticsService
{
    private readonly TransactionRepository _transactionRepository;

    public AnalyticsService(TransactionRepository transactionRepository)
    {
        _transactionRepository = transactionRepository;
    }

    public AnalyticsSummary GetSummary()
    {
        var transactions = _transactionRepository.GetAll().ToList();

        var debits  = transactions.Where(t => t.Type == "debit").ToList();
        var credits = transactions.Where(t => t.Type == "credit").ToList();

        var totalSpent  = debits.Sum(t => t.Amount);
        var totalIncome = credits.Sum(t => t.Amount);

        var months = transactions
            .GroupBy(t => new { t.Date.Year, t.Date.Month })
            .Count();

        // --- Cards ---
        var cards = new SummaryCards
        {
            TotalSpent           = totalSpent,
            TotalIncome          = totalIncome,
            NetSavings           = totalIncome - totalSpent,
            SavingsRate          = totalIncome > 0 ? Math.Round((totalIncome - totalSpent) / totalIncome * 100, 1) : 0,
            AvgMonthlySpend      = months > 0 ? Math.Round(totalSpent / months, 2) : 0,
            AvgTransactionValue  = debits.Count > 0 ? Math.Round(totalSpent / debits.Count, 2) : 0,
            TotalTransactions    = transactions.Count,
            BiggestSpendCategory = debits
                .GroupBy(t => t.CategoryName ?? "Uncategorized")
                .OrderByDescending(g => g.Sum(t => t.Amount))
                .Select(g => g.Key)
                .FirstOrDefault() ?? "N/A"
        };

        // --- Category Breakdown ---
        var categoryBreakdown = debits
            .GroupBy(t => new { Name = t.CategoryName ?? "Uncategorized", Color = t.CategoryColor ?? "#6B7280" })
            .Select(g => new CategoryBreakdown
            {
                CategoryName     = g.Key.Name,
                Color            = g.Key.Color,
                Total            = Math.Round(g.Sum(t => t.Amount), 2),
                TransactionCount = g.Count(),
                Percentage       = totalSpent > 0 ? Math.Round(g.Sum(t => t.Amount) / totalSpent * 100, 1) : 0
            })
            .OrderByDescending(c => c.Total)
            .ToList();

        // --- Monthly Totals ---
        var monthlyTotals = transactions
            .GroupBy(t => new { t.Date.Year, t.Date.Month })
            .OrderBy(g => g.Key.Year).ThenBy(g => g.Key.Month)
            .Select(g => new MonthlyTotal
            {
                Month        = new DateTime(g.Key.Year, g.Key.Month, 1).ToString("MMM yyyy"),
                TotalSpent   = Math.Round(g.Where(t => t.Type == "debit").Sum(t => t.Amount), 2),
                TotalIncome  = Math.Round(g.Where(t => t.Type == "credit").Sum(t => t.Amount), 2),
                Net          = Math.Round(g.Where(t => t.Type == "credit").Sum(t => t.Amount) - g.Where(t => t.Type == "debit").Sum(t => t.Amount), 2)
            })
            .ToList();

        // --- Top 5 Expenses ---
        var topExpenses = debits
            .OrderByDescending(t => t.Amount)
            .Take(5)
            .Select(t => new TopTransaction
            {
                Description  = t.Description,
                Amount       = t.Amount,
                Date         = t.Date.ToString("dd MMM yyyy"),
                CategoryName = t.CategoryName ?? "Uncategorized",
                Color        = t.CategoryColor ?? "#6B7280"
            })
            .ToList();

        return new AnalyticsSummary
        {
            Cards             = cards,
            CategoryBreakdown = categoryBreakdown,
            MonthlyTotals     = monthlyTotals,
            TopExpenses       = topExpenses
        };
    }
}