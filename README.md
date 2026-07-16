# 🌙 Moon Prism Cam

![Sailor Moon](public/hero.webp)

A Sailor Moon–themed webcam app: capture a photo from your webcam and ask Claude what's in it.

## Features

- **Camera** — start/stop your webcam, live preview
- **Capture** — snap a photo from the live feed
- **Ask AI** — sends the photo to Claude (vision) for a playful description
- **Sailor Scout Creator** — a configurable chibi character component (`SailorMoonGirl`) with `color`, `mood`, and `clothing` props; three presets float in the page background, plus a live customizer panel

## Tech stack

- React + TypeScript + Vite
- `@anthropic-ai/sdk`, called from a small Vite dev-server middleware (`vite.config.ts`) so the API key never reaches the browser bundle

## Setup

```bash
npm install
cp .env.example .env
```

Add your key to `.env`:

```
ANTHROPIC_API_KEY=sk-ant-...
```

Then run:

```bash
npm run dev
```

## Notes

- The Sailor Moon image above is fan reference art used for theming inspiration, not original work from this project.
- `.env` is gitignored — never commit your API key.
