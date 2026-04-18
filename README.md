# 🌍 Gemini Footprint Tracker

An awareness project that makes the environmental cost of AI visible — tracking water, CO₂, and energy usage per Gemini API request in real time.

Built for the [DEV Earth Day Challenge 2026](https://dev.to).

→ [Live Demo](https://gemini-footprint-tracker.vercel.app) · [Learn more about the methodology](/learn)

---

## What it does

Every prompt you send to Gemini uses water, energy, and emits CO₂. This tracker uses Gemini's usage metadata (token counts) combined with Google's official published baseline values to estimate the environmental footprint of each request — and aggregates it anonymously across all users via Supabase.

- 💧 Water consumption per request (mL)
- ☁️ CO₂ emissions per request (gCO₂e)
- ⚡ Token-based scaling per model (Flash-Lite / Flash / Pro)
- 📊 Community stats across all sessions
- 🔒 Your API key stays local — never sent anywhere except directly to Gemini

---

## Stack

|                |                                            |
| -------------- | ------------------------------------------ |
| Framework      | React 19 + TypeScript + Vite               |
| Styling        | Tailwind CSS v4                            |
| Animation      | Framer Motion                              |
| Backend        | Supabase (anonymous footprint aggregation) |
| AI             | Gemini API (via `@google/generative-ai`)   |
| Math rendering | KaTeX (`react-katex`)                      |

---

## Getting started

```bash
git clone https://github.com/southy404/gemini-footprint-tracker
cd gemini-footprint-tracker
npm install
npm run dev
```

You'll need:

- A [Gemini API key](https://aistudio.google.com/app/apikey) — paste it into the settings drawer in the app
- A Supabase project for community stats (optional — the app works without it)

For Supabase, create a `.env` file:

```env
VITE_SUPABASE_URL=your_project_url
VITE_SUPABASE_ANON_KEY=your_anon_key
```

---

## Estimation model

The tracker uses Google's officially published baseline for a median Gemini Apps text prompt:

| Metric | Official value |
| ------ | -------------- |
| Water  | 0.26 mL        |
| CO₂    | 0.03 gCO₂e     |
| Energy | 0.24 Wh        |

Estimates are then scaled by weighted token count and a per-model multiplier. Full methodology is documented on the [/learn](/learn) page inside the app.

---

## Project structure

```
src/
├── components/       # UI components (Composer, Topbar, Sidebar, …)
├── hooks/            # useCommunityStats
├── lib/              # gemini.ts, footprint.ts, trackFootprintEvent.ts
├── pages/            # LearnMorePage
└── types/            # chat.ts
```

---

## Disclaimer

This is an independent learning project, not an official Google product or environmental dashboard. Footprint values are estimates based on public baseline data and transparent app-side assumptions — see the methodology page for details.

---

## License

MIT
