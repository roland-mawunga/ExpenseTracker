namespace DotnetAPI.Models;

public class AnalyticsSummary
{
    public SummaryCards Cards { get; set; } = new();
    public List<CategoryBreakdown> CategoryBreakdown { get; set; } = new();
    public List<MonthlyTotal> MonthlyTotals { get; set; } = new();
    public List<TopTransaction> TopExpenses { get; set; } = new();
}

public class SummaryCards
{
    public decimal TotalSpent { get; set; }
    public decimal TotalIncome { get; set; }
    public decimal NetSavings { get; set; }
    public decimal SavingsRate { get; set; }        // percentage e.g. 18.5
    public decimal AvgMonthlySpend { get; set; }
    public decimal AvgTransactionValue { get; set; }
    public int TotalTransactions { get; set; }
    public string BiggestSpendCategory { get; set; } = string.Empty;
}

public class CategoryBreakdown
{
    public string CategoryName { get; set; } = string.Empty;
    public string Color { get; set; } = string.Empty;
    public decimal Total { get; set; }
    public int TransactionCount { get; set; }
    public decimal Percentage { get; set; }         // of total spending
}

public class MonthlyTotal
{
    public string Month { get; set; } = string.Empty;   // "Jan 2024"
    public decimal TotalSpent { get; set; }
    public decimal TotalIncome { get; set; }
    public decimal Net { get; set; }
}

public class TopTransaction
{
    public string Description { get; set; } = string.Empty;
    public decimal Amount { get; set; }
    public string Date { get; set; } = string.Empty;
    public string CategoryName { get; set; } = string.Empty;
    public string Color { get; set; } = string.Empty;
}