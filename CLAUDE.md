# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

A cross-platform Bible memorization app built with Expo (React Native) for iOS, Android, and Web. Users browse Bible passages and practice memorization via a word-hiding difficulty system.

## Commands

All commands run from `BibleMemorizationApp/`:

```bash
npx expo start          # Start dev server (scan QR with Expo Go)
npx expo start --android
npx expo start --ios
npx expo start --web
npm test                # Jest (watchAll mode)
npm run lint            # expo lint
```

## Architecture

### Navigation

`app/(tabs)/index.tsx` defines the single `RootStack` navigator and the `RootStackParamList` type. All screens are registered here. The `(tabs)/` folder name is a remnant of the Expo Router template — the app uses a traditional React Navigation Stack, not tab navigation.

### Data Layer

`db/databaseService.ts` wraps `expo-sqlite`. The pre-bundled database is at `assets/bible.sqlite` and is copied to the device on first launch. Each Bible translation is a separate SQLite table (e.g., `en_kjv`, `en_niv`, `en_nasb`, `ko_gygj`). The active table name is stored in AsyncStorage and broadcast via `utils/Observable.ts` so screens react to translation changes without a global store.

### State Management

No Redux/Zustand. State is local React hooks plus a minimal pub/sub helper (`utils/Observable.ts`) for cross-screen events (specifically translation changes). The observable pattern: `tableNameObservable` notifies `HomeScreen` when the user switches Bible versions in `SettingScreen`.

### Core Feature: Word Hiding

`utils/wordHiding.ts` implements the memorization mechanic — randomly hides a percentage of words (3+ characters) per difficulty level:
- Easy: 20% | Medium: 50% | Hard: 80% | Full: 100%

`components/VerseDisplay.tsx` renders hidden words as gray blocks over the actual text.

### Localization

`i18n/index.ts` configures i18next with `expo-localization` for device language detection (English/Korean). Language preference is persisted in AsyncStorage. Bible translation selection is independent of UI language. Translation strings live in `assets/locales/en.json` and `assets/locales/ko.json`, which also contain all 66 Bible book names.

### History

`utils/history.ts` stores the 30 most recent verse accesses in AsyncStorage as a deduplicated JSON array (most-recent first). Includes book, chapter, verse range, and timestamp.

## Key Conventions

- Path alias `@/*` maps to the `BibleMemorizationApp/` root (configured in `tsconfig.json` and `metro.config.js`).
- `metro.config.js` must declare `.sqlite` as an asset extension for the database to bundle correctly.
- The `assets/bible.sqlite` file is large and pre-built — do not regenerate it programmatically.
- Navigation params are typed via `RootStackParamList` in `app/(tabs)/index.tsx`; keep this updated when adding screens.
