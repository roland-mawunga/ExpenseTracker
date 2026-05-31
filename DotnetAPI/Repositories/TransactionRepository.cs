using System.Data;
using Dapper;
using DotnetAPI.Models;
using Microsoft.Data.Sqlite;

namespace DotnetAPI.Repositories;

public class TransactionRepository
{
    private readonly string _connectionString;

    public TransactionRepository(string connectionString)
    {
        _connectionString = connectionString;
    }

    private IDbConnection CreateConnection() => new SqliteConnection(_connectionString);

    public IEnumerable<Transaction> GetAll()
    {
        using var db = CreateConnection();
        var sql = @"
            SELECT t.*, c.Name as CategoryName, c.Color as CategoryColor
            FROM Transactions t
            LEFT JOIN Categories c ON t.CategoryId = c.Id
            ORDER BY t.Date DESC";
        return db.Query<Transaction>(sql);
    }

    public void BulkInsert(IEnumerable<Transaction> transactions)
    {
        using var db = CreateConnection();
        var sql = @"INSERT INTO Transactions (Date, Description, Amount, Type, CategoryId, ImportedAt)
                    VALUES (@Date, @Description, @Amount, @Type, @CategoryId, @ImportedAt)";
        db.Execute(sql, transactions);
    }

    public void UpdateCategory(int id, int? categoryId)
    {
        using var db = CreateConnection();
        db.Execute("UPDATE Transactions SET CategoryId = @CategoryId WHERE Id = @Id", new { Id = id, CategoryId = categoryId });
    }

    public void UpdateNotes(int id, string? notes)
    {
        using var db = CreateConnection();
        db.Execute("UPDATE Transactions SET Notes = @Notes WHERE Id = @Id", new { Id = id, Notes = notes });
    }

    public void Delete(int id)
    {
        using var db = CreateConnection();
        db.Execute("DELETE FROM Transactions WHERE Id = @Id", new { Id = id });
    }
}