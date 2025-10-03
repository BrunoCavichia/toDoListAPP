using Microsoft.EntityFrameworkCore;
using toDoApp.ApiService.Data;
using DotNetEnv;

var builder = WebApplication.CreateBuilder(args);

// Cargar variables de entorno desde archivo .env en la raíz del proyecto
Env.Load();

var connectionString = Environment.GetEnvironmentVariable("CONNECTION_STRING");

if (string.IsNullOrEmpty(connectionString))
{
    throw new InvalidOperationException("La variable de entorno CONNECTION_STRING no está definida.");
}

// Add service defaults & Aspire client integrations.
builder.AddServiceDefaults();

// Add services to the container.
builder.Services.AddProblemDetails();
builder.Services.AddOpenApi();
builder.Services.AddControllers();

builder.Services.AddDbContext<ApplicationDbContext>(options =>
    options.UseNpgsql(connectionString));

// **Configuración de CORS:**
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowFrontend",
        policy =>
        {
            policy.WithOrigins(
                "http://localhost:3000"  // <--- puerto frontend
            )
            .AllowAnyHeader()
            .AllowAnyMethod();
        });
});

var app = builder.Build();

// **Habilita CORS ANTES que el manejador de excepciones**
app.UseCors("AllowFrontend");

// Configure the HTTP request pipeline.
app.UseExceptionHandler();

if (app.Environment.IsDevelopment())
{
    app.MapOpenApi();
}

string[] summaries = new[]
{
    "Freezing", "Bracing", "Chilly", "Cool", "Mild",
    "Warm", "Balmy", "Hot", "Sweltering", "Scorching"
};

app.MapGet("/weatherforecast", () =>
{
    var forecast = Enumerable.Range(1, 5).Select(index =>
        new WeatherForecast
        (
            DateOnly.FromDateTime(DateTime.Now.AddDays(index)),
            Random.Shared.Next(-20, 55),
            summaries[Random.Shared.Next(summaries.Length)]
        ))
        .ToArray();
    return forecast;
})
.WithName("GetWeatherForecast");

app.MapDefaultEndpoints();
app.MapControllers();

app.Run();

record WeatherForecast(DateOnly Date, int TemperatureC, string? Summary)
{
    public int TemperatureF => 32 + (int)(TemperatureC / 0.5556);
}
