using System.Data;
using Microsoft.AspNetCore.Mvc; //contiene clases y atributos para la creacion de endpoints
using toDoApp.ApiService.Data;
using toDoApp.ApiService.Models; // importa el namespace interno donde se encuentra la clase DBCONTEXT

namespace toDoApp.ApiService.Controllers // define el ambito logico en donde vive la clase TodoController
{
    [ApiController]
    [Route("[Controller]")]
    public class TodoController : ControllerBase
    {
        private readonly ApplicationDbContext _context = null!;

        public TodoController(ApplicationDbContext context)
        {
            _context = context;
        }

        [HttpPost]
        public async Task<ActionResult> CreateTodo([FromBody] TodoItem item)
        {
            _context.TodoItems.Add(item);
            await _context.SaveChangesAsync();

            return CreatedAtAction(nameof(GetTodo), new { id = item.Id }, item);
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<TodoItem>> GetTodo(int id)
        {
            var todo = await _context.TodoItems.FindAsync(id);
            if (todo == null)
            {
                return NotFound();
            }

            return todo;
        }

        [HttpGet]
        public async Task<IEnumerable<TodoItem>> GetAll()
        {
            return _context.TodoItems.ToList();
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateTodo(int id, [FromBody] TodoItem item)
        {
            var todo = await _context.TodoItems.FindAsync(id);

            if (todo == null)
            {
                return NotFound();
            }

            if (id != item.Id)
            {
                return BadRequest("El id No coincide");
            }

            todo.IsCompleted = item.IsCompleted;

            _context.Entry(todo).Property(e => e.IsCompleted).IsModified = true;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DBConcurrencyException)
            {
                if (!_context.TodoItems.Any(e => e.Id == id))
                {
                    return NotFound();
                }
                else
                {
                    throw;
                }
            }
            return NoContent();
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteTodo(int id)
        {
            var todo = await _context.TodoItems.FindAsync(id);

            if (todo == null)
            {
                return NotFound();
            }

            _context.TodoItems.Remove(todo);

            await _context.SaveChangesAsync();

            return NoContent();
        }
    }
}
