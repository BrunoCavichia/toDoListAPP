using Microsoft.EntityFrameworkCore;
using toDoApp.ApiService.Models;

namespace toDoApp.ApiService.Data
{
    public class ApplicationDbContext : DbContext
    {
        public ApplicationDbContext(DbContextOptions<ApplicationDbContext> options)
            : base(options)
        {
        }

        public DbSet<TodoItem> TodoItems { get; set; }
    }
}
