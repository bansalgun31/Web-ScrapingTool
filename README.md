# Web Scraping Tool

A small frontend demo that lets users enter a URL and display scraped data returned from a backend scraping service. Built with React, TypeScript, Vite and Tailwind CSS.

**Features:**
- **URL input:** Enter a website URL to scrape.
- **Scraping request:** Sends requests to a backend scraping service (mock or real).
- **Results display:** Shows structured scraped data and handles loading/error states.

**Live demo:** https://web-scrapingtool.netlify.app/ (assignment/demo site)

**Getting Started**

Prerequisites:

- Node.js (v18+ recommended)
- npm (or your preferred Node package manager)

Install and run in development mode:

```powershell
npm install
npm run dev
```

Build for production:

```powershell
npm run build
npm run preview
```

**Project Structure**

- `index.html` — App entry page.
- `src/main.tsx` — App bootstrap and global providers.
- `src/App.tsx` — Main app layout.
- `src/index.css` — Tailwind + global styles.
- `src/components/` — Reusable React components (e.g. `CompanyCard.tsx`, `ConfigPanel.tsx`, `ProgressStats.tsx`).
- `src/services/` — Scraper service & mocks (e.g. `mockScraper.ts`).
- `src/types/` — TypeScript types (`scraper.ts`).
- `src/utils/` — Helpers (`export.ts`, `validation.ts`).

**Scripts** (from `package.json`)

- `npm run dev` — Start dev server (Vite).
- `npm run build` — Build production assets.
- `npm run preview` — Preview the built app.
- `npm run lint` — Run ESLint.

**Configuration**

- Vite config: `vite.config.ts`.
- TypeScript config: `tsconfig.json` / `tsconfig.app.json`.
- Tailwind: `tailwind.config.js` and `postcss.config.js`.

**Usage Notes**

- The UI expects a backend scraping endpoint. During development the app may use `src/services/mockScraper.ts` to return fake data.
- If you wire a real backend, update the service client in `src/services/` to point to your API.

**Contributing**

1. Fork the repo and create a branch for your change.
2. Open a PR describing the change.

**License & Contact**

Please refer to the LICENSE file in the repository.

Questions or improvements — open an issue or a PR. 


