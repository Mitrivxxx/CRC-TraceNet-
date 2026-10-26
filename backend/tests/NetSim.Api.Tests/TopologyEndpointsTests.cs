using System.Net;
using System.Net.Http.Json;
using System.Text.Json;
using NetSim.Api.Models;
using Xunit;

namespace NetSim.Api.Tests;

public class TopologyEndpointsTests : IClassFixture<NetSimWebApplicationFactory>
{
    private readonly NetSimWebApplicationFactory _factory;

    public TopologyEndpointsTests(NetSimWebApplicationFactory factory)
    {
        _factory = factory;
    }

    [Fact]
    public async Task Save_Then_Get_Returns_Same_Topology()
    {
        var client = _factory.CreateClient();

        var graph = new
        {
            nodes = new[] { new { id = "pc-1", label = "PC 1" } },
            edges = Array.Empty<object>(),
        };
        var request = new { name = "Moja siec", data = graph };

        // POST
        var createResponse = await client.PostAsJsonAsync("/api/topologies", request);
        Assert.Equal(HttpStatusCode.Created, createResponse.StatusCode);

        var created = await createResponse.Content.ReadFromJsonAsync<TopologySummary>();
        Assert.NotNull(created);
        Assert.Equal("Moja siec", created!.Name);
        Assert.NotEqual(Guid.Empty, created.Id);

        // GET by id
        var detail = await client.GetFromJsonAsync<TopologyDetail>($"/api/topologies/{created.Id}");
        Assert.NotNull(detail);
        Assert.Equal(created.Id, detail!.Id);
        Assert.Equal("Moja siec", detail.Name);

        var nodes = detail.Data.GetProperty("nodes");
        Assert.Equal(JsonValueKind.Array, nodes.ValueKind);
        Assert.Equal("pc-1", nodes[0].GetProperty("id").GetString());
    }

    [Fact]
    public async Task List_Contains_Saved_Topology()
    {
        var client = _factory.CreateClient();
        var request = new { name = "Lista-test", data = new { nodes = Array.Empty<object>(), edges = Array.Empty<object>() } };

        await client.PostAsJsonAsync("/api/topologies", request);

        var list = await client.GetFromJsonAsync<List<TopologySummary>>("/api/topologies");
        Assert.NotNull(list);
        Assert.Contains(list!, t => t.Name == "Lista-test");
    }

    [Fact]
    public async Task Update_Changes_Name_And_Data()
    {
        var client = _factory.CreateClient();

        var createResponse = await client.PostAsJsonAsync("/api/topologies", new
        {
            name = "Przed",
            data = new { nodes = Array.Empty<object>(), edges = Array.Empty<object>() },
        });
        var created = await createResponse.Content.ReadFromJsonAsync<TopologySummary>();
        Assert.NotNull(created);

        var updateResponse = await client.PutAsJsonAsync($"/api/topologies/{created!.Id}", new
        {
            name = "Po",
            data = new { nodes = new[] { new { id = "server-1" } }, edges = Array.Empty<object>() },
        });
        Assert.Equal(HttpStatusCode.OK, updateResponse.StatusCode);

        var detail = await client.GetFromJsonAsync<TopologyDetail>($"/api/topologies/{created.Id}");
        Assert.Equal("Po", detail!.Name);
        Assert.Equal("server-1", detail.Data.GetProperty("nodes")[0].GetProperty("id").GetString());
    }

    [Fact]
    public async Task Save_Without_Name_Returns_BadRequest()
    {
        var client = _factory.CreateClient();

        var response = await client.PostAsJsonAsync("/api/topologies", new
        {
            name = "",
            data = new { nodes = Array.Empty<object>() },
        });

        Assert.Equal(HttpStatusCode.BadRequest, response.StatusCode);
    }

    [Fact]
    public async Task Get_Unknown_Id_Returns_NotFound()
    {
        var client = _factory.CreateClient();

        var response = await client.GetAsync($"/api/topologies/{Guid.NewGuid()}");

        Assert.Equal(HttpStatusCode.NotFound, response.StatusCode);
    }
}
