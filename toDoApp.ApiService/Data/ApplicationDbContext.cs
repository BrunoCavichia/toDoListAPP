using Microsoft.EntityFrameworkCore;
using toDoApp.ApiService.Models;

namespace toDoApp.ApiService.Data
{
    public class ApplicationDbContext : DbContext //creamos una clase publica  que hereda desde DbContext
    {
        public ApplicationDbContext(DbContextOptions<ApplicationDbContext> options)
            : base(options) { }

        public DbSet<TodoItem> TodoItems { get; set; }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
{
        base.OnModelCreating(modelBuilder);
        modelBuilder.Entity<TodoItem>().ToTable("todoitems"); // nombre en minúsculas
}

    }
}
