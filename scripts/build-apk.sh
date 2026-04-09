#!/bin/bash

# Script untuk build APK dan copy ke folder builds
# Usage: ./scripts/build-apk.sh [debug|release]

set -e

BUILD_TYPE=${1:-debug}
TIMESTAMP=$(date +"%Y%m%d_%H%M%S")

echo "🔨 Building Android APK ($BUILD_TYPE)..."

cd android

if [ "$BUILD_TYPE" = "release" ]; then
    echo "📦 Building Release APK..."
    ./gradlew assembleRelease
    
    APK_SOURCE="app/build/outputs/apk/release/app-release.apk"
    APK_DEST="../builds/test-rn-release-${TIMESTAMP}.apk"
    APK_LATEST="../builds/test-rn-release-latest.apk"
    
elif [ "$BUILD_TYPE" = "debug" ]; then
    echo "🐛 Building Debug APK..."
    ./gradlew assembleDebug
    
    APK_SOURCE="app/build/outputs/apk/debug/app-debug.apk"
    APK_DEST="../builds/test-rn-debug-${TIMESTAMP}.apk"
    APK_LATEST="../builds/test-rn-debug-latest.apk"
else
    echo "❌ Invalid build type. Use 'debug' or 'release'"
    exit 1
fi

cd ..

if [ -f "android/$APK_SOURCE" ]; then
    echo "✅ Build successful!"
    echo "📋 Copying APK to builds folder..."
    
    cp "android/$APK_SOURCE" "$APK_DEST"
    cp "android/$APK_SOURCE" "$APK_LATEST"
    
    echo "✅ APK saved to:"
    echo "   - $APK_DEST"
    echo "   - $APK_LATEST"
    
    # Get APK size
    APK_SIZE=$(du -h "$APK_DEST" | cut -f1)
    echo "📦 APK Size: $APK_SIZE"
    
    echo ""
    echo "📱 Next steps:"
    echo "   1. Test APK: adb install $APK_LATEST"
    echo "   2. Upload to cloud storage (Google Drive, Dropbox, etc.)"
    echo "   3. Update download link in builds/README.md"
    echo ""
else
    echo "❌ Build failed! APK not found at android/$APK_SOURCE"
    exit 1
fi
