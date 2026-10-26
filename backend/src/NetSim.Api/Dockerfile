# Kontekst budowania: katalog ./backend
# syntax=docker/dockerfile:1

FROM mcr.microsoft.com/dotnet/sdk:10.0 AS build
WORKDIR /src

# Restore (cache warstwy po plikach projektu)
COPY src/NetSim.Api/NetSim.Api.csproj src/NetSim.Api/
RUN dotnet restore src/NetSim.Api/NetSim.Api.csproj

# Build + publish
COPY src/ src/
RUN dotnet publish src/NetSim.Api/NetSim.Api.csproj -c Release -o /app/publish /p:UseAppHost=false

FROM mcr.microsoft.com/dotnet/aspnet:10.0 AS runtime
WORKDIR /app
ENV ASPNETCORE_URLS=http://+:8080
EXPOSE 8080
COPY --from=build /app/publish .
ENTRYPOINT ["dotnet", "NetSim.Api.dll"]
