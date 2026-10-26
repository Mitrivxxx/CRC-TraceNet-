var builder = DistributedApplication.CreateBuilder(args);

// PostgreSQL 17 (zgodne z docker-compose) + baza netsim.
// Nazwa zasobu "Default" sprawia, ze connection string trafia do ConnectionStrings:Default.
var postgres = builder.AddPostgres("postgres")
    .WithImageTag("17.6")
    .WithDataVolume()
    .AddDatabase("Default", databaseName: "netsim");

var api = builder.AddProject<Projects.NetSim_Api>("api")
    .WithReference(postgres)
    .WaitFor(postgres)
    .WithHttpHealthCheck("/health")
    .WithExternalHttpEndpoints();

var web = builder.AddViteApp("web", "../../../frontend")
    .WithReference(api)
    .WaitFor(api)
    .WithEnvironment("VITE_API_URL", api.GetEndpoint("http"));

// CORS: pozwol originowi frontendu (port Vite moze byc dynamiczny pod Aspire).
api.WithEnvironment("Cors__AllowedOrigins", ReferenceExpression.Create(
    $"{web.GetEndpoint("http")},http://localhost:5173,http://localhost"));

builder.Build().Run();
