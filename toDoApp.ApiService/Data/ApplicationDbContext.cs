using Microsoft.EntityFrameworkCore;
using toDoApp.ApiService.Models;

namespace toDoApp.ApiService.Data
{
    public class ApplicationDbContext : DbContext
    {
        public ApplicationDbContext(DbContextOptions<ApplicationDbContext> options)
            : base(options) { }

        public DbSet<TodoItem> TodoItems { get; set; }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);
            // No usar ToTable("TodoItem") para que EF use "TodoItems"
        }
    }
}
