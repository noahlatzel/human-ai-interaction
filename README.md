# Human-AI Interaction

This repository contains our project for the Human-AI Interaction course.

# Repository Layout

- `apps/api`: FastAPI backend (served under `/haii/api`)
- `apps/web`: React/Vite frontend (served under `/haii/`)
- `docker-compose.yml`: builds/runs both services
- `packages`: shared code

# Running locally with Docker

```bash
docker compose up -d --build
# Frontend: http://localhost:8080/haii/
# API health: http://localhost:8080/haii/api/healthz
```

# Deploying on a VM (e.g. Hetzner)

These steps assume a fresh Ubuntu/Debian VM with a public IP.

1) Install Docker + Compose plugin (if not there already)
```bash
sudo apt-get update
sudo apt-get install -y ca-certificates curl gnupg
sudo install -m 0755 -d /etc/apt/keyrings
curl -fsSL https://download.docker.com/linux/ubuntu/gpg | sudo gpg --dearmor -o /etc/apt/keyrings/docker.gpg
echo "deb [arch=$(dpkg --print-architecture) signed-by=/etc/apt/keyrings/docker.gpg] https://download.docker.com/linux/ubuntu $(lsb_release -cs) stable" | sudo tee /etc/apt/sources.list.d/docker.list
sudo apt-get update
sudo apt-get install -y docker-ce docker-ce-cli containerd.io docker-buildx-plugin docker-compose-plugin
sudo usermod -aG docker $USER  # log out/in to apply
```

2) Clone the repo onto the VM
```bash
git clone https://github.com/your-org/human-ai-interaction.git
cd human-ai-interaction
```

3) Set production-ready env values
- Edit `apps/api/.env` (at minimum change `HAII_JWT_SECRET`, `HAII_ADMIN_EMAIL`, `HAII_ADMIN_PASSWORD`) or just copy using `cp apps/api/.env.template apps/api/.env`.
- Keep `HAII_ROOT_PATH=/haii/api` (matches nginx and the frontend build).

4) Start the stack
```bash
docker compose up -d --build
docker compose ps   # both api and web should be Up
```

5) Open the firewall (if using UFW) and expose HTTP
```bash
sudo ufw allow 80/tcp
sudo ufw allow 443/tcp   # if you plan to terminate TLS here
sudo ufw enable
```

6) Access the site
- Frontend: `http://<server-ip>:8080/haii/` (current compose maps 8080->80).
- API health: `http://<server-ip>:8080/haii/api/healthz`.

If you want it directly on port 80 behind a domain:
- Change the `ports` mapping in `docker-compose.yml` for `web` from `"8080:80"` to `"80:80"`, or put a reverse proxy (nginx/Caddy/Traefik) in front that forwards `https://yourdomain/haii` to `web:80`.
- Ensure DNS points to the VM. If using a proxy, let it pass through the `/haii` subpath unchanged.

# Updating

```bash
git pull
docker compose up -d --build
```

# Troubleshooting

- API failing to start with SQLite: ensure the compose uses `sqlite+aiosqlite:////data/auth.db` and the `api_data` volume is mounted (current compose already does).
- 502 from nginx: confirm the API container is running and `docker compose logs api` is clean; the web nginx proxies `/haii/api/` to the API at root with `X-Forwarded-Prefix` set.
