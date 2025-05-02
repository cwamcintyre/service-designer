# This script starts the Uvicorn server for the API

# Define the module and host/port configuration
$module = "src.main:app"  # Updated to reflect the correct module path
$hostname = "localhost"
$port = 8000

# Start Uvicorn
Write-Host "Starting Uvicorn server for ${module} on ${hostname}:${port}..."
uvicorn $module --host $hostname --port $port --reload