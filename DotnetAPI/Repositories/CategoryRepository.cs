using System.Data;
using Dapper;
using Microsoft.Data.Sqlite;
using DotnetAPI.Models;

namespace DotnetAPI.Repositories;

public class CategoryRepository
{
    private readonly string _connectionString;

    public CategoryRepository(string connectionString)
    {
        _connectionString = connectionString;
    }

    private IDbConnection CreateConnection() => new SqliteConnection(_connectionString);

    public IEnumerable<Category> GetAll()
    {
        using var db = CreateConnection();
        return db.Query<Category>("SELECT * FROM Categories");
    }

    public Category? GetById(int id)
    {
        using var db = CreateConnection();
        return db.QueryFirstOrDefault<Category>("SELECT * FROM Categories WHERE Id = @Id", new { Id = id });
    }

    public int Create(Category category)
    {
        using var db = CreateConnection();
        var sql = "INSERT INTO Categories (Name, Keywords, Color) VALUES (@Name, @Keywords, @Color) RETURNING Id";
        return db.ExecuteScalar<int>(sql, category);
    }

    public void Update(Category category)
    {
        using var db = CreateConnection();
        var sql = "UPDATE Categories SET Name = @Name, Keywords = @Keywords, Color = @Color WHERE Id = @Id";
        db.Execute(sql, category);
    }

    public void Delete(int id)
    {
        using var db = CreateConnection();
        db.Execute("DELETE FROM Categories WHERE Id = @Id", new { Id = id });
    }
}