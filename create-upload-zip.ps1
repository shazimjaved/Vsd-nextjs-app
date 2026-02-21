# PowerShell script to create a zip file excluding large directories
# Run this script in the project root directory

# Files and folders to exclude
$excludeItems = @(
    "node_modules",
    ".next",
    ".git",
    "build",
    "build_backup",
    ".firebase",
    "dist",
    "coverage",
    ".nyc_output",
    "*.log",
    ".env.local",
    ".env.*.local",
    "firebase-debug.log",
    "firebase-debug.*.log",
    ".DS_Store",
    "Thumbs.db",
    ".vscode",
    ".idea",
    "*.swp",
    "*.swo",
    "*~"
)

# Output zip file name
$zipFileName = "VSD-main-upload.zip"

# Remove existing zip if it exists
if (Test-Path $zipFileName) {
    Remove-Item $zipFileName
    Write-Host "Removed existing zip file" -ForegroundColor Yellow
}

Write-Host "Creating zip file (excluding large directories)..." -ForegroundColor Green
Write-Host "This may take a few minutes..." -ForegroundColor Yellow

# Get all files and folders, excluding the specified items
$filesToZip = Get-ChildItem -Path . -Recurse | Where-Object {
    $item = $_
    $shouldExclude = $false
    
    foreach ($exclude in $excludeItems) {
        if ($item.FullName -like "*\$exclude" -or $item.FullName -like "*\$exclude\*" -or $item.Name -like $exclude) {
            $shouldExclude = $true
            break
        }
    }
    
    -not $shouldExclude
}

# Create zip file
Compress-Archive -Path $filesToZip.FullName -DestinationPath $zipFileName -Force

# Get the size of the created zip
$zipSize = (Get-Item $zipFileName).Length / 1MB
Write-Host "`nZip file created: $zipFileName" -ForegroundColor Green
Write-Host "Size: $([math]::Round($zipSize, 2)) MB" -ForegroundColor Green

if ($zipSize -gt 100) {
    Write-Host "`n⚠️ WARNING: Zip file is still larger than 100MB!" -ForegroundColor Red
    Write-Host "Consider using GitHub connection instead." -ForegroundColor Yellow
} else {
    Write-Host "`n✅ Zip file is ready for upload!" -ForegroundColor Green
}

