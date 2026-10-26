using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Mvc.Testing;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.DependencyInjection;
using NetSim.Api.Data;

namespace NetSim.Api.Tests;

/// <summary>
/// Fabryka testowa, ktora zastepuje PostgreSQL baza in-memory, dzieki czemu
/// testy integracyjne nie wymagaja dzialajacego Postgresa.
/// </summary>
public class NetSimWebApplicationFactory : WebApplicationFactory<Program>
{
    protected override void ConfigureWebHost(IWebHostBuilder builder)
    {
        builder.UseEnvironment("Testing");

        builder.ConfigureServices(services =>
        {
            // Usun rejestracje DbContext uzywajaca Npgsql.
            var descriptors = services
                .Where(d =>
                    d.ServiceType == typeof(DbContextOptions<AppDbContext>) ||
                    d.ServiceType == typeof(AppDbContext) ||
                    (d.ServiceType.FullName?.Contains("DbContextOptions") ?? false))
                .ToList();

            foreach (var descriptor in descriptors)
            {
                services.Remove(descriptor);
            }

            services.AddDbContext<AppDbContext>(options =>
                options.UseInMemoryDatabase("netsim-tests"));
        });
    }
}
