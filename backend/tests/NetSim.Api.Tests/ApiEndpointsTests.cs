using System.Net;
using System.Net.Http.Json;
using NetSim.Api.Models;
using Xunit;

namespace NetSim.Api.Tests;

public class ApiEndpointsTests : IClassFixture<NetSimWebApplicationFactory>
{
    private readonly NetSimWebApplicationFactory _factory;

    public ApiEndpointsTests(NetSimWebApplicationFactory factory)
    {
        _factory = factory;
    }

    [Fact]
    public async Task Health_Returns_Ok()
    {
        var client = _factory.CreateClient();

        var response = await client.GetAsync("/api/health");

        Assert.Equal(HttpStatusCode.OK, response.StatusCode);
    }

    [Fact]
    public async Task DeviceTypes_Contains_Expected_Catalog()
    {
        var client = _factory.CreateClient();

        var items = await client.GetFromJsonAsync<List<DeviceTypeDto>>("/api/device-types");

        Assert.NotNull(items);
        var ids = items!.Select(i => i.Id).ToList();
        Assert.Contains("pc", ids);
        Assert.Contains("server", ids);
        Assert.Contains("switch", ids);
        Assert.Contains("router", ids);
    }
}
