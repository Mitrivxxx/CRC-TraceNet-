using System.Text.Json;
using Microsoft.EntityFrameworkCore;
using Microsoft.OpenApi;
using NetSim.Api.Data;
using NetSim.Api.Models;
using Scalar.AspNetCore;

var builder = WebApplication.CreateBuilder(args);

builder.AddServiceDefaults();

// --- OpenAPI / Swagger ---
// Dokument OpenAPI jest generowany pod /openapi/v1.json i serwowany przez
// Swagger UI oraz Scalar. Tutaj uzupelniamy go o metadane (tytul, opis, wersja).
builder.Services.AddOpenApi(options =>
{
    options.AddDocumentTransformer((document, _, _) =>
    {
        document.Info = new OpenApiInfo
        {
            Title = "NetSim API",
            Version = "v1",
            Description =
                "API symulatora sieci (NetSim). Pozwala na pobranie katalogu typow urzadzen " +
                "oraz zapis, odczyt, aktualizacje i usuwanie topologii sieci.",
            Contact = new OpenApiContact
            {
                Name = "Zespol NetSim",
            },
        };
        return Task.CompletedTask;
    });
});

// --- Baza danych (PostgreSQL) ---
// Aspire AppHost wstrzykuje ConnectionStrings:Default przez WithReference.
var connectionString = builder.Configuration.GetConnectionString("Default")
    ?? "Host=db;Port=5432;Database=netsim;Username=netsim;Password=netsim";

builder.Services.AddDbContext<AppDbContext>(options =>
    options.UseNpgsql(connectionString));

// --- CORS (frontend) ---
const string FrontendCors = "frontend";
var allowedOrigins = builder.Configuration["Cors:AllowedOrigins"]?.Split(',', StringSplitOptions.RemoveEmptyEntries | StringSplitOptions.TrimEntries)
    ?? new[] { "http://localhost:5173", "http://localhost" };

builder.Services.AddCors(options =>
{
    options.AddPolicy(FrontendCors, policy =>
        policy.WithOrigins(allowedOrigins)
            .AllowAnyHeader()
            .AllowAnyMethod());
});

var app = builder.Build();

app.MapDefaultEndpoints();

// --- Migracje przy starcie (tylko dla relacyjnej bazy) ---
await ApplyMigrationsAsync(app);

if (app.Environment.IsDevelopment())
{
    // Dokument OpenAPI: /openapi/v1.json
    app.MapOpenApi();

    // Swagger UI: /swagger
    app.UseSwaggerUI(options =>
    {
        options.SwaggerEndpoint("/openapi/v1.json", "NetSim API v1");
        options.DocumentTitle = "NetSim API - Swagger";
        options.RoutePrefix = "swagger";
    });

    // Scalar (alternatywny podglad): /scalar/v1
    app.MapScalarApiReference();
}

app.UseCors(FrontendCors);

// --- Endpointy ---
app.MapGet("/api/health", async (AppDbContext db) =>
{
    var dbOk = false;
    try
    {
        dbOk = await db.Database.CanConnectAsync();
    }
    catch
    {
        dbOk = false;
    }

    return Results.Ok(new
    {
        status = "ok",
        database = dbOk ? "up" : "down",
        timestamp = DateTime.UtcNow
    });
})
.WithName("GetHealth")
.WithTags("System")
.WithSummary("Stan aplikacji")
.WithDescription("Zwraca status API oraz informacje, czy polaczenie z baza danych dziala.")
.Produces(StatusCodes.Status200OK);

app.MapGet("/api/device-types", () => Results.Ok(DeviceCatalog.Items))
    .WithName("GetDeviceTypes")
    .WithTags("Katalog")
    .WithSummary("Lista typow urzadzen")
    .WithDescription("Zwraca statyczny katalog typow urzadzen sieciowych dostepnych w palecie frontendu.")
    .Produces<IReadOnlyList<DeviceTypeDto>>(StatusCodes.Status200OK);

// --- Topologie (zapis / odczyt) ---
var topologies = app.MapGroup("/api/topologies")
    .WithTags("Topologie");

topologies.MapGet("", async (AppDbContext db) =>
{
    var items = await db.Topologies
        .OrderByDescending(t => t.CreatedAt)
        .Select(t => new TopologySummary(t.Id, t.Name, t.CreatedAt))
        .ToListAsync();
    return Results.Ok(items);
})
.WithName("ListTopologies")
.WithSummary("Lista topologii")
.WithDescription("Zwraca skrocone opisy wszystkich zapisanych topologii, posortowane od najnowszej.")
.Produces<List<TopologySummary>>(StatusCodes.Status200OK);

topologies.MapGet("/{id:guid}", async (Guid id, AppDbContext db) =>
{
    var entity = await db.Topologies.FindAsync(id);
    if (entity is null)
    {
        return Results.NotFound();
    }

    var data = JsonSerializer.Deserialize<JsonElement>(entity.DataJson);
    return Results.Ok(new TopologyDetail(entity.Id, entity.Name, entity.CreatedAt, data));
})
.WithName("GetTopology")
.WithSummary("Pobierz topologie")
.WithDescription("Zwraca pelna topologie (wraz z grafem wezlow i polaczen) dla podanego identyfikatora.")
.Produces<TopologyDetail>(StatusCodes.Status200OK)
.Produces(StatusCodes.Status404NotFound);

topologies.MapPost("", async (SaveTopologyRequest request, AppDbContext db) =>
{
    if (string.IsNullOrWhiteSpace(request.Name))
    {
        return Results.BadRequest(new { error = "Nazwa topologii jest wymagana." });
    }

    var entity = new Topology
    {
        Name = request.Name.Trim(),
        DataJson = SerializeData(request.Data),
        CreatedAt = DateTime.UtcNow,
    };

    db.Topologies.Add(entity);
    await db.SaveChangesAsync();

    return Results.Created(
        $"/api/topologies/{entity.Id}",
        new TopologySummary(entity.Id, entity.Name, entity.CreatedAt));
})
.WithName("CreateTopology")
.WithSummary("Utworz topologie")
.WithDescription("Zapisuje nowa topologie. Wymagana jest niepusta nazwa; dane grafu sa opcjonalne.")
.Produces<TopologySummary>(StatusCodes.Status201Created)
.Produces(StatusCodes.Status400BadRequest);

topologies.MapPut("/{id:guid}", async (Guid id, SaveTopologyRequest request, AppDbContext db) =>
{
    var entity = await db.Topologies.FindAsync(id);
    if (entity is null)
    {
        return Results.NotFound();
    }

    if (string.IsNullOrWhiteSpace(request.Name))
    {
        return Results.BadRequest(new { error = "Nazwa topologii jest wymagana." });
    }

    entity.Name = request.Name.Trim();
    entity.DataJson = SerializeData(request.Data);
    await db.SaveChangesAsync();

    return Results.Ok(new TopologySummary(entity.Id, entity.Name, entity.CreatedAt));
})
.WithName("UpdateTopology")
.WithSummary("Zaktualizuj topologie")
.WithDescription("Aktualizuje nazwe i dane istniejacej topologii o podanym identyfikatorze.")
.Produces<TopologySummary>(StatusCodes.Status200OK)
.Produces(StatusCodes.Status400BadRequest)
.Produces(StatusCodes.Status404NotFound);

topologies.MapDelete("/{id:guid}", async (Guid id, AppDbContext db) =>
{
    var entity = await db.Topologies.FindAsync(id);
    if (entity is null)
    {
        return Results.NotFound();
    }

    db.Topologies.Remove(entity);
    await db.SaveChangesAsync();
    return Results.NoContent();
})
.WithName("DeleteTopology")
.WithSummary("Usun topologie")
.WithDescription("Usuwa topologie o podanym identyfikatorze.")
.Produces(StatusCodes.Status204NoContent)
.Produces(StatusCodes.Status404NotFound);

app.Run();

static string SerializeData(JsonElement data) =>
    data.ValueKind is JsonValueKind.Undefined or JsonValueKind.Null
        ? "{}"
        : data.GetRawText();

static async Task ApplyMigrationsAsync(WebApplication app)
{
    using var scope = app.Services.CreateScope();
    var db = scope.ServiceProvider.GetRequiredService<AppDbContext>();

    if (!db.Database.IsRelational())
    {
        return;
    }

    try
    {
        await db.Database.MigrateAsync();
    }
    catch (Exception ex)
    {
        var logger = app.Services.GetRequiredService<ILogger<Program>>();
        logger.LogError(ex, "Nie udalo sie zastosowac migracji bazy danych przy starcie.");
    }
}

// Udostepnione dla testow integracyjnych (WebApplicationFactory).
public partial class Program;
