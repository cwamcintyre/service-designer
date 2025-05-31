docker build --no-cache --progress=plain -t form-web-runner -f ..\apps\web\runner\Dockerfile ..
if ($LASTEXITCODE -ne 0) {
    Write-Host "Docker command failed. Stopping script."
    exit $LASTEXITCODE
}

docker build --no-cache --progress=plain -t form-api-runner -f ..\apps\api\forms-runner\Dockerfile ..
if ($LASTEXITCODE -ne 0) {
    Write-Host "Docker command failed. Stopping script."
    exit $LASTEXITCODE
}

docker build --no-cache --progress=plain -t form-web-designer -f ..\apps\web\designer\Dockerfile ..
if ($LASTEXITCODE -ne 0) {
    Write-Host "Docker command failed. Stopping script."
    exit $LASTEXITCODE
}

docker build --no-cache --progress=plain -t form-api-designer -f ..\apps\api\forms-designer\Dockerfile ..
if ($LASTEXITCODE -ne 0) {
    Write-Host "Docker command failed. Stopping script."
    exit $LASTEXITCODE
}

docker build --no-cache --progress=plain -t designer-chat-api -f ..\apps\api\designer-chat\Dockerfile ..
if ($LASTEXITCODE -ne 0) {
    Write-Host "Docker command failed. Stopping script."
    exit $LASTEXITCODE
}
