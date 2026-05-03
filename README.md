# Spentt

> Know where it went.

A minimal, privacy-first expense tracker. Your data lives in your own Google Drive — we never see it.

## Stack

- React 18 + Vite
- No backend — Google Drive as database
- PWA — installable on any device

## Getting started

```bash
npm install
npm run dev
```

## Project structure

```
src/
  components/
    home/          # Logo, Greeting, TotalCard, CardStack, QuickAdd, etc.
    sheets/        # CategorySheet, DateSheet
  screens/         # HomeScreen, HistoryScreen, ReceiptScreen, ShareScreen, SettingsScreen, ProfileScreen
  hooks/           # useExpenses, useGreeting, usePWA
  utils/           # dateHelpers, greeting
  data/            # categories, sampleExpenses
```

## Next steps

1. Add Google OAuth (`src/auth/googleAuth.js`)
2. Add Google Drive sync (`src/services/driveSync.js`)
3. Replace `SAMPLE_EXPENSES` with Drive-loaded data

## Deployment

```bash
npm run build
# Deploy dist/ to Vercel
```
