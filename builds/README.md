# APK Builds

Folder ini berisi APK build untuk testing dan distribution.

## ⚠️ Catatan Penting

APK files **TIDAK** di-commit ke Github karena ukurannya besar. 

## 📦 Download APK

APK tersedia di link eksternal berikut: https://drive.google.com/file/d/1UkX3qtlvgJ8g2zobG2wZemrQ_A_Suuv-/view?usp=sharing

### Latest Release (Debug Build)
- **Version:** 0.0.1
- **Build Date:** 9 April 2026
- **Build Type:** Debug
- **File Size:** 126 MB
- **File Name:** `test-rn-debug-latest.apk`
- **Download Link:** [Upload ke Google Drive / Dropbox / OneDrive dan paste link di sini]

> ⚠️ **Catatan:** APK file ada di folder `builds/` tapi tidak di-commit ke Github karena ukurannya besar (126MB). 
> Untuk share, upload file ke cloud storage dan update link di atas.

### Cara Upload APK:

#### Option 1: Google Drive
1. Upload APK ke Google Drive
2. Klik kanan file → Get link
3. Set permission: "Anyone with the link can view"
4. Copy link dan update di README ini

#### Option 2: Dropbox
1. Upload APK ke Dropbox
2. Klik "Share" → "Create link"
3. Copy link dan update di README ini

#### Option 3: OneDrive
1. Upload APK ke OneDrive
2. Klik "Share" → "Anyone with the link can view"
3. Copy link dan update di README ini

#### Option 4: WeTransfer
1. Go to https://wetransfer.com/
2. Upload APK
3. Get download link (valid 7 days)
4. Share link

## 🔨 Build APK Sendiri

Jika ingin build APK sendiri:

### Debug APK (untuk testing)
```bash
cd android
./gradlew assembleDebug
```
APK akan tersimpan di: `android/app/build/outputs/apk/debug/app-debug.apk`

### Release APK (untuk production)
```bash
cd android
./gradlew assembleRelease
```
APK akan tersimpan di: `android/app/build/outputs/apk/release/app-release.apk`

### Copy APK ke folder builds
```bash
# Debug
cp android/app/build/outputs/apk/debug/app-debug.apk builds/test-rn-debug.apk

# Release
cp android/app/build/outputs/apk/release/app-release.apk builds/test-rn-release.apk
```

## 📱 Install APK di Device

### Via ADB (USB)
```bash
adb install builds/test-rn-debug.apk
```

### Via File Manager
1. Transfer APK ke device (via USB, email, atau cloud)
2. Buka file manager di device
3. Tap APK file
4. Allow "Install from unknown sources" jika diminta
5. Tap "Install"

## 🔐 Signing Configuration

Untuk release build, Anda perlu setup signing configuration:

1. Generate keystore:
```bash
keytool -genkeypair -v -storetype PKCS12 -keystore test-rn-release.keystore -alias test-rn -keyalg RSA -keysize 2048 -validity 10000
```

2. Edit `android/gradle.properties`:
```properties
MYAPP_RELEASE_STORE_FILE=test-rn-release.keystore
MYAPP_RELEASE_KEY_ALIAS=test-rn
MYAPP_RELEASE_STORE_PASSWORD=your_password
MYAPP_RELEASE_KEY_PASSWORD=your_password
```

3. Edit `android/app/build.gradle`:
```gradle
signingConfigs {
    release {
        if (project.hasProperty('MYAPP_RELEASE_STORE_FILE')) {
            storeFile file(MYAPP_RELEASE_STORE_FILE)
            storePassword MYAPP_RELEASE_STORE_PASSWORD
            keyAlias MYAPP_RELEASE_KEY_ALIAS
            keyPassword MYAPP_RELEASE_KEY_PASSWORD
        }
    }
}
```

## 📋 Build Checklist

Sebelum build APK untuk distribution:

- [ ] Update version di `android/app/build.gradle`
- [ ] Update version di `package.json`
- [ ] Test semua fitur works
- [ ] Update environment variables untuk production
- [ ] Build release APK
- [ ] Test APK di device fisik
- [ ] Upload ke cloud storage
- [ ] Update download link di README ini

## 🐛 Troubleshooting

### APK tidak bisa di-install
- Enable "Install from unknown sources" di device settings
- Check APK tidak corrupt (re-download)

### App crashes setelah install
- Check environment variables sudah benar
- Check Google OAuth credentials untuk production

### Build failed
- Run `cd android && ./gradlew clean`
- Check Java/Gradle version
- Check Android SDK installed

---

**Note:** Untuk production release, gunakan signed APK dan upload ke Google Play Store atau distribution platform lainnya.
