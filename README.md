# 🌿 Unmasked

> **A low-pressure, sensory-friendly friendship platform designed by and for the neurodivergent community.**

[![Expo](https://img.shields.io/badge/Expo-57-black?logo=expo)](https://expo.dev/)
[![React Native](https://img.shields.io/badge/React%20Native-0.86.0-61DAFB?logo=react)](https://reactnative.dev/)
[![Firebase](https://img.shields.io/badge/Firebase-12+-FFCA28?logo=firebase)](https://firebase.google.com/)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](LICENSE)

---

## 📌 The Problem

Traditional social and friend-finding apps rely on high-pressure mechanics: vague bio prompts, endless small talk, immediate pressure for "coffee/pub dates," and environments built around subtle social cues. For autistic, ADHD, and neurodivergent (ND) individuals, this often leads to social exhaustion, masking, and sensory overload.

---

## 💡 The Solution

**Unmasked** reimagines how neurodivergent adults meet platonic friends locally. Instead of forcing typical social norms, Unmasked prioritizes **clarity, special interests, low sensory environments, and energy management.**

### Key Features

- **🧩 Special Interest Matching:** Match based on deep hyperfixations, hobbies, and specific connection styles (*Parallel Play*, *Infodump Exchange*, or *Activity-First*).
- **🔋 Spoon / Energy Meter:** Share your daily social capacity so matches know when you're low on social "spoons."
- **💬 Direct Communication Preferences:** Set clear expectations for direct language, response time, and toggle built-in **Tone Indicators** (`[joke]`, `[sarcasm]`, `[literal]`).
- **📍 Sensory-Friendly Venue Finder:** Crowdsourced local meeting spots rated by noise levels, lighting, crowd density, and quiet space access.
- **⏱️ "Low-Pressure" Meetup Agreements:** Pre-agreed 30-minute micro-dates, physical contact boundaries, and built-in exit agreements.

---

## 🎨 Sensory-Friendly Design System

Unmasked is built from the ground up to prevent visual and sensory fatigue:

- **Soft Palette:** Natural, low-saturation earth tones (Sage, Slate, Creams, and Deep Charcoal). Zero pure white (`#FFFFFF`) or pure black (`#000000`).
- **Low-Cognitive-Load UI:** Humanist sans-serif typography, left-aligned text blocks, generous line-spacing, and rounded UI components.
- **Minimal Motion:** Respects system settings with strict constraints against unexpected animations or auto-playing visual noise.

---

## 🛠️ Tech Stack

Built for cross-platform efficiency as a solo-developer project:

- **Frontend:** [React Native](https://reactnative.dev/) 0.86.0 with [Expo](https://expo.dev/) SDK 57 and Expo Router
- **Backend & Auth:** [Firebase Authentication](https://firebase.google.com/docs/auth) & [Cloud Firestore](https://firebase.google.com/docs/firestore)
- **Architecture:** Feature-first TypeScript modules with a token-based accessible design system
- **Maps & Geolocation:** Planned `react-native-maps` integration with privacy-preserving geohashes

---

## 🚀 Getting Started

### Prerequisites

- Node.js 22.13 or higher
- Expo Go app on your iOS/Android device OR Xcode / Android Studio simulators

### Local setup

```bash
npm install
cp .env.example .env
npm start
```

Native Firebase uses the platform service files. Add the Google Web OAuth
client ID to `.env` to enable Google Sign-In on Android.

Native Firebase Authentication setup is documented in
[`docs/authentication.md`](./docs/authentication.md).

On macOS, `npm run android` automatically uses the Java runtime bundled with
Android Studio when `JAVA_HOME` is not already configured.
