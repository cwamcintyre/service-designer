# Use the official .NET SDK image as a build image
FROM mcr.microsoft.com/dotnet/sdk:8.0 AS build
WORKDIR /src

# Copy the project file and restore dependencies
COPY Component.Form.WebAPI.csproj ./
RUN dotnet restore

# Copy the rest of the application files
COPY . ./

# Publish the application
RUN dotnet publish -c Release -o /app

# Use the official .NET runtime image as a base image
FROM mcr.microsoft.com/dotnet/aspnet:8.0 AS base
WORKDIR /app

# Copy the published application files
COPY --from=build /app ./

# Expose the port the app runs on
EXPOSE 8080

# Set the entry point for the application
ENTRYPOINT ["dotnet", "Component.Form.WebAPI.dll"]