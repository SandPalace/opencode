# PIXI Windows Installer
#
# Usage:
#   iwr -useb https://algolab.academy/install.ps1 | iex
#
# Options (set as env vars before running, or edit a local copy):
#   $env:PIXI_VERSION      = "1.8.0"           # specific version (default: latest)
#   $env:PIXI_INSTALL_DIR  = "C:\tools\pixi"   # custom install dir (default: %LOCALAPPDATA%\pixicode\bin)
#   $env:PIXI_NO_MODIFY_PATH = "1"             # skip PATH modification
#   $env:PIXI_BINARY       = "C:\path\pixi.exe" # install from a local file

$ErrorActionPreference = 'Stop'

$Repo          = 'sandpalace/opencode'
$InstallDir    = if ($env:PIXI_INSTALL_DIR) { $env:PIXI_INSTALL_DIR } else { Join-Path $env:LOCALAPPDATA 'pixicode\bin' }
$RequestedVer  = $env:PIXI_VERSION
$NoModifyPath  = $env:PIXI_NO_MODIFY_PATH -eq '1'
$LocalBinary   = $env:PIXI_BINARY

function Write-Info($msg)  { Write-Host $msg -ForegroundColor Gray }
function Write-Ok($msg)    { Write-Host $msg -ForegroundColor Green }
function Write-Warn($msg)  { Write-Host $msg -ForegroundColor Yellow }
function Write-Err($msg)   { Write-Host $msg -ForegroundColor Red }

function Get-Arch {
    $archEnv = $env:PROCESSOR_ARCHITECTURE
    if ($env:PROCESSOR_ARCHITEW6432) { $archEnv = $env:PROCESSOR_ARCHITEW6432 }
    switch ($archEnv) {
        'ARM64' { return 'arm64' }
        'AMD64' { return 'x64' }
        default {
            Write-Err "Unsupported architecture: $archEnv"
            exit 1
        }
    }
}

function Test-Avx2 {
    try {
        $sig = '[DllImport("kernel32.dll")] public static extern bool IsProcessorFeaturePresent(int feature);'
        $type = Add-Type -MemberDefinition $sig -Name 'PixiKernel32' -Namespace 'PixiInstall' -PassThru
        return $type::IsProcessorFeaturePresent(40) # PF_AVX2_INSTRUCTIONS_AVAILABLE
    } catch {
        return $false
    }
}

function Resolve-AssetName($arch) {
    if ($arch -eq 'arm64') {
        return 'pixicode-windows-arm64.exe'
    }
    if (Test-Avx2) {
        return 'pixicode-windows-x64.exe'
    }
    Write-Info '  CPU does not report AVX2 — using baseline build'
    return 'pixicode-windows-x64-baseline.exe'
}

function Get-LatestPixiTag {
    # Query the releases API and return the newest tag matching pixi-v*.
    # Anonymous calls are rate-limited to 60/hr per IP — plenty for install scripts.
    $api = "https://api.github.com/repos/$Repo/releases?per_page=30"
    $headers = @{ 'User-Agent' = 'pixi-installer' }
    $releases = Invoke-RestMethod -Uri $api -Headers $headers -UseBasicParsing
    foreach ($r in $releases) {
        if ($r.tag_name -like 'pixi-v*' -and -not $r.draft -and -not $r.prerelease) {
            return $r.tag_name
        }
    }
    throw "No pixi-v* release found in the latest 30 releases of $Repo"
}

function Resolve-DownloadUrl($asset, $version) {
    if ($version) {
        return "https://github.com/$Repo/releases/download/pixi-v$version/$asset"
    }
    try {
        $tag = Get-LatestPixiTag
        return "https://github.com/$Repo/releases/download/$tag/$asset"
    } catch {
        Write-Warn "  Could not query GitHub API ($($_.Exception.Message)); falling back to releases/latest"
        return "https://github.com/$Repo/releases/latest/download/$asset"
    }
}

function Add-UserPath($dir) {
    $current = [Environment]::GetEnvironmentVariable('Path', 'User')
    if (-not $current) { $current = '' }
    $parts = $current -split ';' | Where-Object { $_ -ne '' }
    if ($parts -contains $dir) {
        Write-Info "  PATH already contains $dir"
        return
    }
    $newPath = if ($current) { "$current;$dir" } else { $dir }
    [Environment]::SetEnvironmentVariable('Path', $newPath, 'User')
    $env:Path = "$env:Path;$dir"
    Write-Ok "  Added $dir to user PATH"
}

Write-Host ''
Write-Host 'Installing PIXI...' -ForegroundColor Cyan
Write-Host ''

New-Item -ItemType Directory -Force -Path $InstallDir | Out-Null
$target = Join-Path $InstallDir 'pixi.exe'
$aliasTarget = Join-Path $InstallDir 'pixicode.exe'

if ($LocalBinary) {
    if (-not (Test-Path $LocalBinary)) {
        Write-Err "Binary not found: $LocalBinary"
        exit 1
    }
    Copy-Item -Path $LocalBinary -Destination $target -Force
    Write-Ok "  Installed from local binary"
} else {
    $arch  = Get-Arch
    $asset = Resolve-AssetName $arch
    $url   = Resolve-DownloadUrl $asset $RequestedVer

    Write-Info "  Arch:    $arch"
    Write-Info "  Asset:   $asset"
    Write-Info "  Source:  $url"
    Write-Info "  Target:  $target"
    Write-Host ''

    $tmp = Join-Path $env:TEMP ("pixi-install-" + [Guid]::NewGuid().ToString('N') + '.exe')
    try {
        $progressBackup = $ProgressPreference
        $ProgressPreference = 'SilentlyContinue'
        Invoke-WebRequest -Uri $url -OutFile $tmp -UseBasicParsing
        $ProgressPreference = $progressBackup
    } catch {
        Write-Err "Download failed: $($_.Exception.Message)"
        if ($RequestedVer) {
            Write-Info "  Check that release pixi-v$RequestedVer exists: https://github.com/$Repo/releases"
        }
        exit 1
    }

    Move-Item -Path $tmp -Destination $target -Force
    Write-Ok "  Downloaded and installed"
}

# Provision the pixicode alias so both commands match the npm package's bin entries.
Copy-Item -Path $target -Destination $aliasTarget -Force

if (-not $NoModifyPath) {
    Add-UserPath $InstallDir
}

Write-Host ''
try {
    $version = & $target --version 2>$null
    if ($LASTEXITCODE -eq 0 -and $version) {
        Write-Ok "PIXI $version is ready."
    } else {
        Write-Warn 'Installed, but --version check did not return cleanly.'
    }
} catch {
    Write-Warn 'Installed, but could not run pixi.exe yet. Open a new terminal and try: pixi --version'
}

Write-Host ''
Write-Host 'To start:' -ForegroundColor Cyan
Write-Host '  cd <your-project>   # open a folder' -ForegroundColor Gray
Write-Host '  pixi                # run PIXI' -ForegroundColor Gray
Write-Host ''
Write-Host 'Docs: https://github.com/sandpalace/opencode' -ForegroundColor Gray
Write-Host ''
