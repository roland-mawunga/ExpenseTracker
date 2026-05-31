using System.Data;
using Dapper;
using Microsoft.Data.Sqlite;

public class DatabaseBootstrap
{
    private readonly string _connectionString;

    public DatabaseBootstrap(string connectionString)
    {
        _connectionString = connectionString;
    }

    public void Initialize()
    {
        using var connection = new SqliteConnection(_connectionString);
        connection.Open();

        var sql = File.ReadAllText("Database/schema.sql");
        connection.Execute(sql);

        SeedDefaultCategories(connection);
    }

    private void SeedDefaultCategories(IDbConnection db)
    {
        var count = db.ExecuteScalar<int>("SELECT COUNT(*) FROM Categories");
        if (count > 0) return;

        var categories = new[]
        {
            new { Name = "Food & Drink",    Keywords = "restaurant,cafe,mcd,kfc,spur,nandos,uber eats,mr d", Color = "#F97316" },
            new { Name = "Transport",       Keywords = "uber,bolt,fuel,petrol,parking,toll",                  Color = "#3B82F6" },
            new { Name = "Groceries",       Keywords = "checkers,woolworths,pick n pay,spar,shoprite,clicks", Color = "#22C55E" },
            new { Name = "Entertainment",   Keywords = "netflix,spotify,dstv,showmax,steam,gaming",           Color = "#A855F7" },
            new { Name = "Transfers",       Keywords = "transfer,payment,eft,zapper,snapscan",                Color = "#EAB308" },
        };

        db.Execute("INSERT INTO Categories (Name, Keywords, Color) VALUES (@Name, @Keywords, @Color)", categories);
    }
}