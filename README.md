# Landing Page Design

This is a code bundle for Landing Page Design. The original project is available at https://www.figma.com/design/lK6gmI3UJh0AxMbwjkMnYt/Landing-Page-Design.

## Running the code

Run `npm i` to install the dependencies.

Run `npm run dev` to start the development server.

## Backend Services

Backend services (email signup, design partner applications) are hosted separately and are **not** included in this repository. The frontend expects the following environment variables at build time:

- `VITE_EMAIL_SERVICE_URL` -- Email signup API base URL. Defaults to `https://api.arkhivesstudio.com` in production and `http://localhost:4000` in development.
- `VITE_DESIGN_PARTNER_SERVICE_URL` -- Design Partner application API base URL. Defaults to `https://api.arkhivesstudio.com` in production and `http://localhost:8000` in development.

## Deployment

The site is deployed to GitHub Pages from the `docs/` directory with a custom domain (`landing.arkhivesstudio.com`). To rebuild the production bundle:

```bash
npm run build
cp public/404.html docs/404.html
```

Ensure `docs/CNAME` contains `landing.arkhivesstudio.com` after each rebuild.
