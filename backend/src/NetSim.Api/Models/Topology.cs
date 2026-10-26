using System.ComponentModel.DataAnnotations;

namespace NetSim.Api.Models;

/// <summary>
/// Zapisana topologia sieci. Na etapie MVP nie jest jeszcze uzywana przez UI
/// (topologia zyje w przegladarce), ale stanowi fundament pod przyszle
/// testowanie transmisji plikow z kodowaniem cyklicznym (CRC).
/// </summary>
public class Topology
{
    public Guid Id { get; set; } = Guid.NewGuid();

    [MaxLength(200)]
    public string Name { get; set; } = string.Empty;

    /// <summary>Serializowana (JSON) struktura topologii: wezly i polaczenia.</summary>
    public string DataJson { get; set; } = "{}";

    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
}
