using Microsoft.AspNetCore.Mvc;
using DotnetAPI.Models;
using DotnetAPI.Repositories;

namespace DotnetAPI.Controllers;

[ApiController]
[Route("api/[controller]")]
public class CategoriesController : ControllerBase
{
    private readonly CategoryRepository _categoryRepository;

    public CategoriesController(CategoryRepository categoryRepository)
    {
        _categoryRepository = categoryRepository;
    }

    [HttpGet]
    public IActionResult GetAll()
    {
        return Ok(_categoryRepository.GetAll());
    }

    [HttpPost]
    public IActionResult Create(Category category)
    {
        var id = _categoryRepository.Create(category);
        category.Id = id;
        return CreatedAtAction(nameof(GetAll), new { id }, category);
    }

    [HttpPut("{id}")]
    public IActionResult Update(int id, Category category)
    {
        category.Id = id;
        _categoryRepository.Update(category);
        return NoContent();
    }

    [HttpDelete("{id}")]
    public IActionResult Delete(int id)
    {
        _categoryRepository.Delete(id);
        return NoContent();
    }
}