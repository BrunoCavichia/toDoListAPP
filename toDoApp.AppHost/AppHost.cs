var builder = DistributedApplication.CreateBuilder(args);

var apiService = builder.AddProject<Projects.toDoApp_ApiService>("apiservice")
    .WithHttpHealthCheck("/health");

builder.AddProject<Projects.toDoApp_Web>("webfrontend")
    .WithExternalHttpEndpoints()
    .WithHttpHealthCheck("/health")
    .WithReference(apiService)
    .WaitFor(apiService);


builder.AddContainer("postgresql", "postgres:15")
    .WithUrl("http://localhost:5432", "PostgreSQL");

builder.Build().Run();
