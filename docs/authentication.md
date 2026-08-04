# Authentication

Unmasked uses native Firebase Authentication, following the same approach as
SìChef:

- email and password on Android and iOS;
- Google Sign-In on Android;
- Sign in with Apple on iOS;
- persisted sessions through AsyncStorage;
- a route guard protecting the tab navigator;
- a minimal identity document at `users/{uid}` in Cloud Firestore.

The welcome screen always honors the selected intent. **Find your people** signs
out any persisted account and opens registration. **I already have an account**
signs out any persisted account and opens the login form. Auth routes are never
redirected to the tabs merely because an old session is still being cleared. If
profile creation fails after an email account is created, the new Auth account
is rolled back to avoid leaving a partial signed-in session.

Authentication screens use a compact, low-pressure hierarchy: the primary email action
is visually dominant, social providers use neutral outlined controls, recovery links use
Ocean rather than the Sunflower accent, and the alternate login/registration route sits
outside the form card. Email submission remains disabled until the local email and
password requirements are satisfied. Keyboard return actions move through the fields and
submit the final one. Disabled actions use explicit neutral colors rather than reduced
opacity so their labels remain readable. Fields show an Ocean focus outline and local
errors under the affected input. Credential errors appear in an accessible Rose-soft
banner between the screen introduction and the form card. This associates feedback with
the whole login flow without changing spacing inside the form or separating the password,
recovery link, and primary action. Login failures deliberately do
not reveal whether an email is registered; they ask the person to check both credentials
or reset the password. A check icon may confirm only that the email format is valid; its
accessibility label makes that limited meaning explicit and it never confirms that the
account exists.

Registration follows the same hierarchy and feedback model. Local name, email, password,
and password-confirmation issues appear under their respective fields; Firebase or profile
creation failures appear after the primary **Create account** action. The action stays
disabled until all local requirements are satisfied, so local guidance appears after a
field loses focus instead of requiring a press on the disabled action. Social registration
remains neutral, and the alternate sign-in route is presented on two lines outside the
form card.

Firestore profile writes have a 12-second timeout so disabled APIs, missing
databases, or unavailable rules cannot leave an authentication form spinning
indefinitely. Retrying registration with credentials created by an interrupted
attempt resumes that account and completes its profile.

The previous `EXPO_PUBLIC_FIREBASE_*` web values are not used by this native
integration. Firebase reads its configuration from `google-services.json` and
`GoogleService-Info.plist` instead.

## Firebase Console setup

Enable these providers in **Firebase Console → Authentication → Sign-in
method**:

1. Email/Password
2. Google
3. Apple

The native Firebase apps must use the package and bundle identifier
`com.unmasked.unmasked`. Download the resulting files into the project root:

- `google-services.json`
- `GoogleService-Info.plist`

These files must be downloaded again whenever the native Firebase app
configuration changes.

## Google OAuth client

Google Sign-In requires an OAuth client of type **Web application**, even for
the Android native flow, because Firebase exchanges its ID token.

1. In Firebase, enable the Google provider.
2. Add the debug and release SHA-1/SHA-256 fingerprints to the Android app.
3. Download a fresh `google-services.json`.
4. Copy the Web client ID into `.env`:

```dotenv
EXPO_PUBLIC_GOOGLE_WEB_CLIENT_ID=000000000000-example.apps.googleusercontent.com
```

The Web client ID is a public client identifier, not a client secret.

## Apple configuration

The Expo config enables `usesAppleSignIn` and the
`expo-apple-authentication` plugin. The Apple provider must also be enabled in
Firebase Authentication and configured for the same Apple Developer team used
to sign the iOS build.

Apple only returns the person's name and relay email during the first consent.
Unmasked stores the available values in `users/{uid}` immediately after sign-in.

## Native rebuild

Changes to native auth plugins or Firebase service files require a fresh native
build:

```bash
npx expo prebuild --clean
npm run android
```

For iOS, install pods through Expo's prebuild/run flow and test Apple Sign-In on
a real device where possible.

## Firestore

The authenticated client writes basic identity fields to `users/{uid}`. Rules
must only allow a signed-in user to read and update their own document. Public
profile data intended for discovery should live in a separately reviewed data
model rather than exposing private auth identity fields.

The project uses the named Enterprise database `default` in `europe-west8`.
React Native Firebase must receive that database ID explicitly because an
unspecified client connects to the distinct special database `(default)`.
The repository ships owner-only rules in `firestore.rules`; publish them with:

```bash
firebase use unmasked-b62af
firebase deploy --only firestore:default
```
