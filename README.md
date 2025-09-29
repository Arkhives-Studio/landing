
  # Landing Page Design

  This is a code bundle for Landing Page Design. The original project is available at https://www.figma.com/design/lK6gmI3UJh0AxMbwjkMnYt/Landing-Page-Design.

  ## Running the code

  Run `npm i` to install the dependencies.

Run `npm run dev` to start the development server.

## Email Signup Service

This repository now includes an Express-based microservice that captures emails and stores them in PostgreSQL.

### Local development

```bash
# from the repo root
cd docker
docker compose up --build
```

The command runs both the Postgres database and the API. The API listens on `http://localhost:4000`. The frontend expects the service URL from `VITE_EMAIL_SERVICE_URL`, defaulting to `http://localhost:4000` when not provided.

### Render deployment

Deploy the service on Render using the Docker blueprint at `services/email-service/render.yaml`. Supply the following environment variables in Render:

- `DATABASE_URL` – managed Postgres connection string
- `PORT` – set to `4000`
- `CORS_ORIGIN` – allowed origins (e.g. `https://arkhives-studio.github.io/landing`)

### Frontend integration

The landing page `Hero` form submits email addresses to the microservice via `POST /emails`. Status feedback is displayed to users as the request progresses.
  