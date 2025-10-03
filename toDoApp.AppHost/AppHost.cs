var builder = DistributedApplication.CreateBuilder(args);

var apiService = builder.AddProject<Projects.toDoApp_ApiService>("apiservice")
    .WithHttpHealthCheck("/health");

var postgres = builder.AddPostgres("postgres")
                      .WithHostPort(5432)
                      .WithLifetime(ContainerLifetime.Persistent);

var postgresdb = postgres.AddDatabase("postgresdb");



builder.AddViteApp("frontend", packageManager: "yarn")
       .WithEndpoint("http", endpoint => endpoint.Port = 3000)
          .WithYarnPackageInstallation();

builder.Build().Run();

