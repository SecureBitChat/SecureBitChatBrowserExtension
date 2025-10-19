# Build script for SecureBit Chat Extension
# This script builds the extension for Edge browser

Write-Host "Building SecureBit Chat Extension..." -ForegroundColor Green

# Create extension directory
$extensionDir = "extension-build"
if (Test-Path $extensionDir) {
    Remove-Item $extensionDir -Recurse -Force
}
New-Item -ItemType Directory -Path $extensionDir

# Copy manifest
Copy-Item "extension-manifest.json" "$extensionDir/manifest.json"

# Copy background script
Copy-Item "extension-background.js" "$extensionDir/background.js"

# Copy popup files
Copy-Item "extension-popup.html" "$extensionDir/popup.html"
Copy-Item "extension-popup.js" "$extensionDir/popup.js"

# Copy content scripts
Copy-Item "extension-content.js" "$extensionDir/content.js"
Copy-Item "extension-content.css" "$extensionDir/content.css"

# Copy assets
Write-Host "Copying assets..." -ForegroundColor Yellow
Copy-Item "assets" "$extensionDir/assets" -Recurse
Copy-Item "libs" "$extensionDir/libs" -Recurse
Copy-Item "logo" "$extensionDir/logo" -Recurse
Copy-Item "src" "$extensionDir/src" -Recurse

# Copy built files
if (Test-Path "dist") {
    Copy-Item "dist" "$extensionDir/dist" -Recurse
}

# Note: node_modules are NOT copied because esbuild bundles all dependencies
# into the dist/*.js files with --bundle flag
Write-Host "Skipping node_modules - all dependencies are bundled in dist/*.js files" -ForegroundColor Green

# Copy styles
Copy-Item "src/styles" "$extensionDir/src/styles" -Recurse

# Create necessary icon sizes if they don't exist
$iconSizes = @(16, 32, 48, 128, 256, 512)
foreach ($size in $iconSizes) {
    $iconPath = "$extensionDir/logo/icon-${size}x${size}.png"
    if (-not (Test-Path $iconPath)) {
        # Use existing 72x72 icon as fallback for smaller sizes
        $sourceIcon = "$extensionDir/logo/icon-72x72.png"
        if (Test-Path $sourceIcon) {
            Copy-Item $sourceIcon $iconPath
            Write-Host "Using 72x72 icon for ${size}x${size}..." -ForegroundColor Yellow
        }
    }
}

# Build the main app for extension
Write-Host "Building main app..." -ForegroundColor Yellow
npm run build

# Copy built app files
Copy-Item "dist/app.js" "$extensionDir/dist/app.js"
Copy-Item "dist/app-boot.js" "$extensionDir/dist/app-boot.js"
Copy-Item "dist/qr-local.js" "$extensionDir/dist/qr-local.js"

# Get version from package.json
$packageJson = Get-Content "package.json" | ConvertFrom-Json
$version = $packageJson.version

# Create extension info file
$extensionInfo = @"
SecureBit Chat Extension
Version: $version
Build Date: $(Get-Date -Format "yyyy-MM-dd HH:mm:ss")

Installation Instructions:
1. Open Microsoft Edge
2. Go to edge://extensions/
3. Enable "Developer mode"
4. Click "Load unpacked"
5. Select the extension-build folder

Features:
- P2P secure messaging
- Military-grade encryption
- WebRTC communication
- QR code scanning
- Browser integration
"@

$extensionInfo | Out-File "$extensionDir/README.txt" -Encoding UTF8

Write-Host "Extension built successfully!" -ForegroundColor Green
Write-Host "Extension directory: $extensionDir" -ForegroundColor Cyan
Write-Host ""
Write-Host "To install the extension:" -ForegroundColor Yellow
Write-Host "1. Open Microsoft Edge" -ForegroundColor White
Write-Host "2. Go to edge://extensions/" -ForegroundColor White
Write-Host "3. Enable 'Developer mode'" -ForegroundColor White
Write-Host "4. Click 'Load unpacked'" -ForegroundColor White
Write-Host "5. Select the '$extensionDir' folder" -ForegroundColor White
