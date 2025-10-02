using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Design;
using toDoApp.ApiService.Data;

namespace toDoApp.ApiService.Data
{
    public class ApplicationDbContextFactory : IDesignTimeDbContextFactory<ApplicationDbContext>
    {
        public ApplicationDbContext CreateDbContext(string[] args)
        {
            var optionsBuilder = new DbContextOptionsBuilder<ApplicationDbContext>();

            optionsBuilder.UseNpgsql("Host=localhost;Port=55745;Database=postgres;Username=postgres;Password=zWhTXt9C9UXfW-0aVD+wp*");

            return new ApplicationDbContext(optionsBuilder.Options);
        }
    }
}
