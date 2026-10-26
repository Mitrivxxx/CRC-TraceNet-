using Microsoft.EntityFrameworkCore;
using NetSim.Api.Models;

namespace NetSim.Api.Data;

public class AppDbContext : DbContext
{
    public AppDbContext(DbContextOptions<AppDbContext> options) : base(options)
    {
    }

    public DbSet<Topology> Topologies => Set<Topology>();

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        base.OnModelCreating(modelBuilder);

        modelBuilder.Entity<Topology>(entity =>
        {
            entity.HasKey(t => t.Id);
            entity.Property(t => t.Name).IsRequired().HasMaxLength(200);
            entity.Property(t => t.DataJson).IsRequired();
            entity.Property(t => t.CreatedAt).IsRequired();
        });
    }
}
