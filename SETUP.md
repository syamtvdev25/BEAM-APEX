
# 📱 Hybrid Mobile App Setup Guide

This guide explains how to set up, run, and build your hybrid mobile application for Android using React, TypeScript, and Capacitor.

## 1. Prerequisites
Ensure you have the following installed:
- **Node.js** (v16 or newer)
- **Java Development Kit (JDK) 17** (required for Android builds)
- **Android SDK Tools** (via Command Line Tools or Android Studio, though we won't open the IDE)

## 2. Initial Setup
Run these commands in your project root:

```bash
# Install dependencies
npm install

# Build the web assets
npm run build

# Initialize Capacitor and add Android platform
npx cap add android
```

## 3. Local Web Development
To test the UI in your browser:
```bash
npm run dev
```

## 4. Building the APK (Without Android Studio)
To build a debug APK purely from the command line:

1. **Sync web code to Android project:**
   ```bash
   npm run build
   npx cap sync android
   ```

2. **Generate the APK using Gradle:**
   On Windows:
   ```bash
   cd android
   .\gradlew.bat assembleDebug
   ```
   On macOS/Linux:
   ```bash
   cd android
   ./gradlew assembleDebug
   ```

3. **Locate your APK:**
   After the build finishes, your APK will be located at:
   `android/app/build/outputs/apk/debug/app-debug.apk`

## 5. Installing on a Real Device
1. **Enable Developer Options** on your Android phone (Tap 'Build Number' 7 times in Settings > About Phone).
2. **Enable USB Debugging** in Developer Options.
3. Connect your phone to your PC via USB.
4. **Method A (Easiest):** Transfer the `app-debug.apk` file to your phone via USB or a cloud service (Google Drive/Dropbox) and open it on the phone to install.
5. **Method B (Command Line):** If you have `adb` (Android Debug Bridge) in your PATH:
   ```bash
   npx cap run android
   ```
   *Note: Ensure your device is connected and recognized via `adb devices`.*

## 6. VS Code Workflow
- Use the **Integrated Terminal** for all commands above.
- Use **ESLint** and **Prettier** extensions for code quality.
- The `capacitor.config.ts` allows you to customize the app's package name (`appId`) and display name (`appName`).

## 💡 Pro Tips for Senior Engineers
- **Navigation:** We use `HashRouter` because native apps often serve files from `file://` protocols where standard `BrowserRouter` history fails.
- **Aesthetics:** Tailwind's `active:scale-95` provides haptic-like visual feedback on mobile taps.
- **Performance:** Always run `npm run build` before `npx cap sync` to ensure your native app has the latest production-minified code.
