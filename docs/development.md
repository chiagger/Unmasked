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

## City autocomplete

The profile city field uses Google Places API (New) Autocomplete with the `(cities)`
primary-type collection. Enable **Places API (New)** in Google Cloud and create separate,
API-restricted keys for Android and iOS. Configure local development with:

```dotenv
EXPO_PUBLIC_GOOGLE_PLACES_ANDROID_KEY=
EXPO_PUBLIC_GOOGLE_PLACES_ANDROID_CERT=
EXPO_PUBLIC_GOOGLE_PLACES_IOS_KEY=
```

Restrict the Android key to package `com.unmasked.unmasked` and the relevant SHA-1
certificate fingerprint. Restrict the iOS key to bundle identifier
`com.unmasked.unmasked`. Both keys must also be restricted to Places API (New). Public
Expo variables are embedded in the application, so platform and API restrictions are
required; never reuse a server key. The field remains manually editable when the current
platform credentials are absent.

See Google's [API key security guidance](https://developers.google.com/maps/api-security-best-practices)
and [Autocomplete (New) documentation](https://developers.google.com/maps/documentation/places/web-service/place-autocomplete).
