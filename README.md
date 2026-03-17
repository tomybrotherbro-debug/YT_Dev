# YT Tanglish (YouTube Summarizer)

This is a full-stack web application that fetches the transcript of a given YouTube video and summarizes it using an AI tool (via simulated Playwright browser or API) in a mixture of Tamil and English ("Tanglish").

## Architecture

- **Frontend**: React (Vite) + TailwindCSS
- **Backend**: Express + Node.js (fetches transcripts and generates a direct ChatGPT prompt link)

## Run Locally with Docker

If you want to run this application on any other laptop or server without installing Node.js, you can use Docker.

### Prerequisites
- Install [Docker Desktop](https://www.docker.com/products/docker-desktop/) on your machine.

### Instructions

1. **Clone the repository:**
   ```bash
   git clone https://github.com/tomybrotherbro-debug/YT_Tanglish.git
   cd YT_Tanglish
   ```

2. **Start the application with Docker Compose:**
   Run the following command in the root of the project:
   ```bash
   docker-compose up --build
   ```

3. **Access the application:**
   - **Frontend UI:** Open your browser and go to `http://localhost:80` (or just `http://localhost`)
   - **Backend API:** The API will be running at `http://localhost:4000`

### Troubleshooting
- If another service is already using port `80`, you can change the left-hand port mapping in `docker-compose.yml` under `frontend > ports` (e.g., `"8080:80"`).
- Since this runs headless Playwright in the backend, the first run needs to initialize the AI session credentials.
# YT_Tanglish
# YT_Dev
