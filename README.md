# Firmware Management App

## Prerequisites

- Docker
- Docker Compose

## Installation

1. Clone the repository:
   ```bash
   git clone <repo-url>
   cd <project-root>
   ```
2. Build and start the containers:
   ```bash
   docker compose build
   docker compose up -d
   ```

## Usage

- **Frontend**: Open your browser and navigate to `http://localhost:3000`
- **Backend API**: Accessible at `http://localhost:8080`

## Stopping the Application

To stop and remove the containers, run:
```bash
docker compose down
```

## Environment Variables

If you need to customize ports or settings, update the `.env` file in the project root with keys such as:
```
FRONTEND_PORT=3000
BACKEND_PORT=8080
```
