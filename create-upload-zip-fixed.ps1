# Fixed PowerShell script to create a compatible zip file
# Uses 7-Zip or standard zip format that works with Linux unzip

# Output zip file name
$zipFileName = "VSD-main-upload-fixed.zip"

# Remove existing zip if it exists
if (Test-Path $zipFileName) {
    Remove-Item $zipFileName
    Write-Host "Removed existing zip file" -ForegroundColor Yellow
}

Write-Host "Creating compatible zip file..." -ForegroundColor Green
Write-Host "This may take a few minutes..." -ForegroundColor Yellow

# Create a temporary folder with only needed files
$tempFolder = "VSD-upload-temp"
if (Test-Path $tempFolder) {
    Remove-Item $tempFolder -Recurse -Force
}
New-Item -ItemType Directory -Path $tempFolder | Out-Null

Write-Host "Copying files..." -ForegroundColor Yellow

# Copy only necessary files and folders
$itemsToCopy = @(
    "src",
    "public",
    "apphosting.yaml",
    "firebase.json",
    ".firebaserc",
    "package.json",
    "package-lock.json",
    "next.config.ts",
    "tsconfig.json",
    "tailwind.config.ts",
    "postcss.config.mjs",
    "components.json",
    "firestore.rules",
    "database.rules.json",
    "functions",
    "scripts",
    "docs"
)

foreach ($item in $itemsToCopy) {
    if (Test-Path $item) {
        Copy-Item -Path $item -Destination $tempFolder -Recurse -Force
        Write-Host "  ✓ Copied: $item" -ForegroundColor Green
    } else {
        Write-Host "  ⚠ Skipped (not found): $item" -ForegroundColor Yellow
    }
}

Write-Host "`nCreating zip file..." -ForegroundColor Yellow

# Try to use 7-Zip if available (more compatible)
$use7zip = $false
if (Get-Command "7z" -ErrorAction SilentlyContinue) {
    $use7zip = $true
    & 7z a -tzip "$zipFileName" "$tempFolder\*" | Out-Null
} elseif (Get-Command "7za" -ErrorAction SilentlyContinue) {
    $use7zip = $true
    & 7za a -tzip "$zipFileName" "$tempFolder\*" | Out-Null
} else {
    # Use PowerShell's Compress-Archive but with proper structure
    # Change to temp folder and zip from there
    Push-Location $tempFolder
    Get-ChildItem -Recurse | Compress-Archive -DestinationPath "..\$zipFileName" -Force
    Pop-Location
}

# Clean up temp folder
Remove-Item $tempFolder -Recurse -Force

# Get the size of the created zip
$zipSize = (Get-Item $zipFileName).Length / 1MB
Write-Host "`nZip file created: $zipFileName" -ForegroundColor Green
Write-Host "Size: $([math]::Round($zipSize, 2)) MB" -ForegroundColor Green

if ($zipSize -gt 100) {
    Write-Host "`n⚠️ WARNING: Zip file is still larger than 100MB!" -ForegroundColor Red
    Write-Host "Consider using GitHub connection instead." -ForegroundColor Yellow
} else {
    Write-Host "`n✅ Zip file is ready for upload!" -ForegroundColor Green
    Write-Host "This zip file should work with Firebase Studio's unzip command." -ForegroundColor Green
}

