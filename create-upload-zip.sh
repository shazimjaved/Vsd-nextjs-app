#!/bin/bash
# Script to create a zip file excluding large directories
# Run this script in the project root directory

# Output zip file name
ZIP_FILE="VSD-main-upload.zip"

# Remove existing zip if it exists
if [ -f "$ZIP_FILE" ]; then
    rm "$ZIP_FILE"
    echo "Removed existing zip file"
fi

echo "Creating zip file (excluding large directories)..."
echo "This may take a few minutes..."

# Create zip excluding large directories
zip -r "$ZIP_FILE" . \
    -x "node_modules/*" \
    -x ".next/*" \
    -x ".git/*" \
    -x "build/*" \
    -x "build_backup/*" \
    -x ".firebase/*" \
    -x "dist/*" \
    -x "coverage/*" \
    -x ".nyc_output/*" \
    -x "*.log" \
    -x ".env.local" \
    -x ".env.*.local" \
    -x "firebase-debug.log" \
    -x "firebase-debug.*.log" \
    -x ".DS_Store" \
    -x "Thumbs.db" \
    -x ".vscode/*" \
    -x ".idea/*" \
    -x "*.swp" \
    -x "*.swo" \
    -x "*~" \
    > /dev/null 2>&1

# Get the size of the created zip
ZIP_SIZE=$(du -h "$ZIP_FILE" | cut -f1)
ZIP_SIZE_MB=$(du -m "$ZIP_FILE" | cut -f1)

echo ""
echo "Zip file created: $ZIP_FILE"
echo "Size: $ZIP_SIZE"

if [ "$ZIP_SIZE_MB" -gt 100 ]; then
    echo ""
    echo "⚠️  WARNING: Zip file is still larger than 100MB!"
    echo "Consider using GitHub connection instead."
else
    echo ""
    echo "✅ Zip file is ready for upload!"
fi

