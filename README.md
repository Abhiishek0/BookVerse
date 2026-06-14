<div align="center">
<img width="1200" height="475" alt="GHBanner" src="https://ai.google.dev/static/site-assets/images/share-ais-513315318.png" />
</div>

# Bookverse (React + Vite)

A demo React app wired with Vite and a small Express server for local development.

View the deployed AI Studio app: https://ai.studio/apps/6523166e-4949-4fe4-a09e-f88b26368fc4

## Quickstart

Prerequisites: Node.js 18+ and npm

1. Install dependencies

   npm install

2. Create a local environment file (optional)

   cp .env.example .env.local

   Set any API keys (for example, GEMINI_API_KEY) in `.env.local`.

3. Run the app in development

   npm run dev

4. Build for production

   npm run build

5. Start the production server

   npm run start

## CI

This repository includes a GitHub Actions workflow that runs `npm ci` and `npm run lint` on pushes and PRs to `main`/`master`.

## License

MIT
