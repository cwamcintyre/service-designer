param (
    [switch]$SkipPush,
    [switch]$FormsWeb,
    [switch]$FormsApi,
    [switch]$DesignerWeb,
    [switch]$DesignerApi,
    [switch]$DesignerChatApi
)

function Build-Container {
    param (
        [string]$Name,
        [string]$DockerfilePath,
        [string]$ContextPath
    )

    Write-Host "Building container: $Name"
    docker build --no-cache --progress=plain -t $Name -f $DockerfilePath $ContextPath
    if ($LASTEXITCODE -ne 0) {
        Write-Host "Docker build failed for $Name. Stopping script."
        exit $LASTEXITCODE
    }
}

function Tag-Container {
    param (
        [string]$Name,
        [string]$Repository
    )

    Write-Host "Tagging container: $Name"
    $SourceImage = $Name
    $TargetImage = "$Repository/$($Name):latest"
    docker tag $SourceImage $TargetImage
    if ($LASTEXITCODE -ne 0) {
        Write-Host "Docker tag failed for $Name. Stopping script."
        exit $LASTEXITCODE
    }
}

function Push-Container {
    param (
        [string]$Name,
        [string]$Repository,
        [switch]$SkipPush
    )

    if ($SkipPush) {
        Write-Host "Skipping push for $Name"
    } else {
        Write-Host "Pushing container: $Name"
        $TargetImage = "$Repository/$($Name):latest"
        docker push $TargetImage
        if ($LASTEXITCODE -ne 0) {
            Write-Host "Docker push failed for $Name. Stopping script."
            exit $LASTEXITCODE
        }
    }
}

# Main script
$Repository = "090172996104.dkr.ecr.eu-west-2.amazonaws.com"

if ($FormsWeb) {
    Build-Container -Name "form-web-runner" -DockerfilePath "..\apps\web\runner\Dockerfile" -ContextPath ".."
    Tag-Container -Name "form-web-runner" -Repository $Repository
    Push-Container -Name "form-web-runner" -Repository $Repository -SkipPush:$SkipPush
}

if ($FormsApi) {
    Build-Container -Name "form-api-runner" -DockerfilePath "..\apps\api\forms-runner\Dockerfile" -ContextPath ".."
    Tag-Container -Name "form-api-runner" -Repository $Repository
    Push-Container -Name "form-api-runner" -Repository $Repository -SkipPush:$SkipPush
}

if ($DesignerWeb) {
    Build-Container -Name "form-web-designer" -DockerfilePath "..\apps\web\designer\Dockerfile" -ContextPath ".."
    Tag-Container -Name "form-web-designer" -Repository $Repository
    Push-Container -Name "form-web-designer" -Repository $Repository -SkipPush:$SkipPush
}

if ($DesignerApi) {
    Build-Container -Name "form-api-designer" -DockerfilePath "..\apps\api\forms-designer\Dockerfile" -ContextPath ".."
    Tag-Container -Name "form-api-designer" -Repository $Repository
    Push-Container -Name "form-api-designer" -Repository $Repository -SkipPush:$SkipPush
}

if ($DesignerChatApi) {
    Build-Container -Name "designer-chat-api" -DockerfilePath "..\apps\api\designer-chat\Dockerfile" -ContextPath ".."
    Tag-Container -Name "designer-chat-api" -Repository $Repository
    Push-Container -Name "designer-chat-api" -Repository $Repository -SkipPush:$SkipPush
}