# TaskFlow — End-to-End DevOps Implementation

A hands-on DevOps portfolio project focused on containerizing, testing and automating the deployment of a full-stack web application.

The project uses Docker, Docker Compose, GitHub Actions and a CI/CD-oriented workflow. The goal is to demonstrate how an existing application can be prepared for reliable deployment using practical DevOps tools.

## Project Overview

TaskFlow is a full-stack task management application with user authentication, task management and a dashboard.

This repository focuses on the DevOps implementation around the application rather than claiming original authorship of its application code.

### Application Features

- User registration and login.
- JWT-based authentication.
- Create, update and delete tasks.
- Task filtering and search.
- User profile management.
- MongoDB database integration.

## Technology Stack

| Area | Technologies |
|---|---|
| Frontend | React, Vite, Tailwind CSS |
| Backend | Node.js, Express.js |
| Database | MongoDB |
| Containerization | Docker |
| Multi-container orchestration | Docker Compose |
| CI | GitHub Actions |
| Version control | Git, GitHub |

## DevOps Implementation

### 1. Docker Containerization

Created separate Dockerfiles for the frontend and backend.

**Backend:**
- Uses a Node.js production image.
- Installs production dependencies using `npm ci`.
- Runs as a non-root user.
- Uses environment variables for configuration.

**Frontend:**
- Uses a multi-stage Docker build.
- Builds the React application using Node.js.
- Serves the generated static files using Nginx.

### 2. Docker Compose

Configured three services:

| Service | Purpose | Port |
|---|---|---|
| Frontend | React application served through Nginx | 3000 |
| Backend | Express REST API | 5000 |
| MongoDB | Application database | Internal |

Docker Compose manages the services and persistent MongoDB storage.

### 3. Production Configuration

Implemented backend validation for production settings:

- JWT secret validation.
- MongoDB connection-string validation.
- Frontend origin validation.
- Prevention of exposing internal server errors to clients in production.

### 4. Automated Testing

Backend tests cover authentication, task operations, validation, CORS and production configuration.

Frontend quality checks include ESLint and a production build.

### 5. GitHub Actions

A CI workflow is configured to run on pushes and pull requests targeting the `main` branch.

It includes:
- Backend dependency installation and linting.
- Backend automated tests.
- Frontend dependency installation and linting.
- Frontend production build.

## Architecture

```text
             Developer
                 |
                 | Git Push
                 v
              GitHub
                 |
                 v
          GitHub Actions
                 |
          +------+------+
          |             |
          v             v
     Backend Tests   Frontend Build
          |             |
          +------+------+
                 |
                 v
           Docker Compose
                 |
       +---------+---------+
       |         |         |
       v         v         v
    Frontend  Backend   MongoDB
     Nginx    Express    Database
       |         |
       +---------+
           API
```

## Run the Project Locally

### Prerequisites

- Windows, Linux or macOS.
- Docker Desktop or Docker Engine with Docker Compose.
- Git.

### 1. Clone the repository

```bash
git clone https://github.com/PranavPatil1089/taskflow-devops.git
cd taskflow-devops
```

### 2. Create a JWT secret

Create a `.env` file in the project root:

```env
JWT_SECRET=replace_with_a_secure_random_secret_of_at_least_32_characters
```

Do not commit this file or share its contents.

### 3. Create persistent database storage

```bash
docker volume create taskflow-mongo-data
```

### 4. Build the Docker images

Build the backend:

```bash
docker build -t taskflow-backend:v1 ./server
```

Build the frontend:

```bash
docker build -t taskflow-frontend:v1 \
  --build-arg VITE_API_URL=http://localhost:5000/api/v1 \
  ./client
```

### 5. Start the application

```bash
docker compose up -d
```

### 6. Access the application

- Frontend: http://localhost:3000
- Backend: http://localhost:5000

### 7. Useful Docker Compose commands

Check running services:

```bash
docker compose ps
```

View logs:

```bash
docker compose logs
```

Stop the application:

```bash
docker compose down
```

The named MongoDB volume is retained when the application is stopped using `docker compose down`.

**Important:** Do not use `docker compose down -v` if you want to preserve database data.

## Project Structure

```text
taskflow-devops/
│
├── .github/
│   └── workflows/
│       └── ci.yml
│
├── client/
│   ├── src/
│   ├── Dockerfile
│   └── .dockerignore
│
├── server/
│   ├── src/
│   ├── test/
│   ├── Dockerfile
│   └── .dockerignore
│
├── docs/
├── compose.yaml
├── .gitignore
└── README.md
```

## Project Roadmap

The following are planned extensions, not yet completed:

- [ ] Improve GitHub Actions CI/CD pipeline.
- [ ] Build and publish Docker images to GitHub Container Registry (GHCR).
- [ ] Integrate Trivy for container vulnerability scanning.
- [ ] Deploy the application on Kubernetes using Kind.
- [ ] Implement GitOps deployment using Argo CD.
- [ ] Add monitoring and observability.

## Learning Objectives

This project is intended to demonstrate practical understanding of:

- Linux and application deployment.
- Docker image creation and container management.
- Docker Compose.
- Environment variables and secrets management.
- Git and GitHub workflows.
- Continuous Integration.
- Container security.
- Kubernetes and GitOps as the project evolves.

## Original Application and Attribution

The original TaskFlow application source code is based on the open-source project by [KEX-03](https://github.com/KEX-03/taskflow).

This repository builds upon that application to demonstrate an independent DevOps implementation.

The original MIT licence and copyright notice are retained in the `LICENSE` file.

## Author

**Pranav Patil**

GitHub: [PranavPatil1089](https://github.com/PranavPatil1089)

## License

The original application is distributed under the MIT License. See the `LICENSE` file for details.
