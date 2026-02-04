# Custom Dev Environment (PDS + PLC)

Lightweight Docker setup for running PDS and PLC servers without the full dev container. No Postgres or Redis required (uses SQLite and in-memory stores).

The entry point is this service's `index.js`, which runs the script built from `packages/dev-env/custom/run-pds-plc.ts`.

## Usage

From repo root:

```bash
# Build and run (foreground)
docker compose -f services/custom-dev-env/docker-compose.yml up --build

# Build and run (detached)
docker compose -f services/custom-dev-env/docker-compose.yml up -d --build

# Stop
docker compose -f services/custom-dev-env/docker-compose.yml down
```

## Endpoints

- **PDS**: http://localhost:3000
- **PLC**: http://localhost:3001
