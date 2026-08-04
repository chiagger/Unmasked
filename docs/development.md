# Local development

## Android

Run the native Android development build with:

```bash
npm run android
```

The project launcher:

- uses `JAVA_HOME` when it is configured;
- otherwise detects the Java runtime bundled with Android Studio on macOS;
- runs Expo in headless mode to avoid raw-keyboard terminal errors while keeping
  Metro's development reload behavior enabled.

After installation, start Metro separately when needed:

```bash
npm start
```

If Android reports `INSTALL_FAILED_INSUFFICIENT_STORAGE`, free space or wipe the
virtual device from Android Studio Device Manager before retrying.

Authentication provider setup and native rebuild requirements are documented
in [authentication.md](./authentication.md).
