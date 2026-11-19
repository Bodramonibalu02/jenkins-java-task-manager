# Jenkins Java Task Manager

A small full-stack app for learning a real CI pipeline with Java 21, Spring Boot, PostgreSQL, Docker, Jenkins, and Docker Hub.

## Project layout

- `frontend/` — HTML, CSS, and JavaScript served by Nginx.
- `backend/` — Spring Boot REST API (Java 21, Maven, JPA).
- `docker-compose.yml` — starts the frontend, API, and PostgreSQL database.
- `Jenkinsfile` — checks out the repository, runs tests/package inside a Maven Docker build stage, builds a runtime image, and optionally pushes it to Docker Hub.

## Run the app locally

Prerequisite: Docker Desktop running. From the repository root, run in PowerShell:

```powershell
docker compose up --build
```

Open these URLs:

- Frontend: http://localhost:3015
- Backend health: http://localhost:8085/actuator/health
- Tasks API: http://localhost:8085/api/tasks

The app stores tasks in PostgreSQL. Its data is kept in a Docker named volume when containers are stopped.

Stop containers (keeps database data):

```powershell
docker compose down
```

Stop containers and permanently delete this project's database data:

```powershell
docker compose down -v
```

## Jenkins pipeline overview

1. Checkout — Jenkins downloads the repository from GitHub.
2. Test and Package — Docker builds the Maven stage; Maven runs the automated Spring Boot test and packages the JAR. Tests use an in-memory H2 database, so PostgreSQL does not need to run for this stage.
3. Build Runtime Image — creates a smaller Java 21 runtime image containing the JAR.
4. Push to Docker Hub — optional; disabled by default.

For the push stage, create a Jenkins username/password credential with ID `DOCKERHUB_CREDENTIALS`. Use your Docker Hub username and a Docker Hub access token as the password. Never put credentials in the Jenkinsfile or GitHub repository. Set `PUSH_IMAGE` to `true` when you are ready to push.

The default image name is `balubodramoni/jenkins-task-manager`; you can change `DOCKERHUB_REPO` when starting the Jenkins build.

## Notes

- The Compose database password is a local learning-only value. Do not reuse it in a public deployment.
- This first version runs locally. We will add remote deployment after the Jenkins pipeline is working.
- The Jenkins agent must have Docker CLI access to the Docker daemon. We will configure that carefully when we install Jenkins.
