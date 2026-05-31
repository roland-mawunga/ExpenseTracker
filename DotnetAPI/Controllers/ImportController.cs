using Microsoft.AspNetCore.Mvc;
using DotnetAPI.Repositories;
using DotnetAPI.Services;

namespace DotnetAPI.Controllers;

[ApiController]
[Route("api/[controller]")]
public class ImportController : ControllerBase
{
    private readonly CsvImportService _csvImportService;
    private readonly TransactionRepository _transactionRepository;

    public ImportController(CsvImportService csvImportService, TransactionRepository transactionRepository)
    {
        _csvImportService = csvImportService;
        _transactionRepository = transactionRepository;
    }

    [HttpPost]
    public IActionResult Import(IFormFile file)
    {
        if (file == null || file.Length == 0)
            return BadRequest("No file uploaded.");

        if (!file.FileName.EndsWith(".csv", StringComparison.OrdinalIgnoreCase))
            return BadRequest("File must be a CSV.");

        using var stream = file.OpenReadStream();
        var transactions = _csvImportService.ParseAndCategorize(stream);
        _transactionRepository.BulkInsert(transactions);

        return Ok(new { imported = transactions.Count() });
    }
}