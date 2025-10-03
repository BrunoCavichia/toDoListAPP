using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Design;
using DotNetEnv;

namespace toDoApp.ApiService.Data
{
    public class ApplicationDbContextFactory : IDesignTimeDbContextFactory<ApplicationDbContext>
    {
        public ApplicationDbContext CreateDbContext(string[] args)
        {
            
            Env.Load();

            var optionsBuilder = new DbContextOptionsBuilder<ApplicationDbContext>();

            var connectionString = Environment.GetEnvironmentVariable("CONNECTION_STRING");

            if (string.IsNullOrEmpty(connectionString))
            {
                throw new InvalidOperationException("La variable de entorno CONNECTION_STRING no está definida.");
            }

            optionsBuilder.UseNpgsql(connectionString);

            return new ApplicationDbContext(optionsBuilder.Options);
        }
    }
}
