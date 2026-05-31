using Microsoft.AspNetCore.Mvc;
using DotnetAPI.Repositories;

namespace DotnetAPI.Controllers;

[ApiController]
[Route("api/[controller]")]
public class TransactionsController : ControllerBase
{
    private readonly TransactionRepository _transactionRepository;

    public TransactionsController(TransactionRepository transactionRepository)
    {
        _transactionRepository = transactionRepository;
    }

    [HttpGet]
    public IActionResult GetAll()
    {
        var transactions = _transactionRepository.GetAll();
        return Ok(transactions);
    }

    [HttpPut("{id}/category")]
    public IActionResult UpdateCategory(int id, [FromBody] int? categoryId)
    {
        _transactionRepository.UpdateCategory(id, categoryId);
        return NoContent();
    }

    [HttpPut("{id}/notes")]
    public IActionResult UpdateNotes(int id, [FromBody] string? notes)
    {
        _transactionRepository.UpdateNotes(id, notes);
        return NoContent();
    }

    [HttpDelete("{id}")]
    public IActionResult Delete(int id)
    {
        _transactionRepository.Delete(id);
        return NoContent();
    }
}