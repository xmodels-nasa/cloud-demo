# Cloud Atlas frontend

React, TypeScript, and Vite dashboard for saved cloud predictions, ERA5 inputs, and validation tracks.

## Local development

Requires Node.js 22.12 or newer.

```sh
npm ci
npm run dev
```

Open http://127.0.0.1:5173. Saved-data exploration works without a backend. During development, Vite proxies `/api` and `/health` to http://127.0.0.1:8000.

## GitHub Pages

In repository Settings → Pages, select GitHub Actions as the source. Pushes to `main` build and deploy the site using the included workflow.

For native-resolution point profiles, set the Actions repository variable `VITE_API_BASE_URL` to your fixed ngrok HTTPS URL before deploying. Leave it empty for saved-data exploration only. Changing the variable requires another deployment.

Run the backend from the parent dashboard checkout, allowing the Pages origin:

```sh
CLOUD_CORS_ORIGINS=https://xmodels-nasa.github.io make backend
```

In another terminal, tunnel directly to the backend:

```sh
ngrok http 8000 --url https://YOUR_DOMAIN.ngrok-free.dev
```

Keep the backend, ngrok, and your computer running for API access. The backend source and model data are maintained separately from this frontend repository.

## Verification

```sh
npm run build
node scripts/check-data.mjs
```
