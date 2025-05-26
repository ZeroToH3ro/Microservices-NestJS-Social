# Microservices-NestJS-Social Payment Platform

This project is a microservices-based social payment platform built with NestJS. It demonstrates a distributed architecture with inter-service communication using NATS, data persistence with TypeORM and MySQL, and containerization with Docker.

## Table of Contents

- [Microservices-NestJS-Social Payment Platform](#microservices-nestjs-social-payment-platform)
  - [Table of Contents](#table-of-contents)
  - [Overview](#overview)
  - [Microservices](#microservices)
  - [Technologies Used](#technologies-used)
  - [Project Structure](#project-structure)
  - [Prerequisites](#prerequisites)
  - [Getting Started](#getting-started)
    - [Environment Configuration](#environment-configuration)
    - [Running with Docker Compose](#running-with-docker-compose)
    - [Running Services Individually (Development)](#running-services-individually-development)
  - [API Documentation](#api-documentation)
  - [Key Features](#key-features)
  - [Directory Structure (High-Level)](#directory-structure-high-level)

## Overview

The platform consists of several microservices working together to handle user management, payment processing, and API gateway functionalities. This architecture allows for scalability, resilience, and independent development and deployment of services.

## Microservices

1.  **HTTP API Gateway (`http-api-gateway`)**:
    *   The single entry point for all client requests.
    *   Routes requests to the appropriate downstream microservices.
    *   Handles request validation, authentication (if implemented), and response aggregation.
    *   Provides Swagger API documentation.

2.  **User Microservice (`user-microservices`)**:
    *   Manages user data, including registration, login, profile updates, and user retrieval.
    *   Communicates with other services for user-related events.

3.  **Payment Microservice (`payment-microservices`)**:
    *   Handles all payment-related operations, such as creating payments, retrieving payment history, and updating payment statuses.

## Technologies Used

*   **Backend Framework**: NestJS (TypeScript)
*   **Database**: MySQL (managed with TypeORM)
*   **Message Broker**: NATS
*   **Containerization**: Docker, Docker Compose
*   **API Documentation**: Swagger (OpenAPI)
*   **Package Manager**: pnpm

## Project Structure

The project is organized as a monorepo with each microservice residing in its own directory. Shared configurations or utilities could be placed in a `libs` folder if needed (not currently implemented).

```
social-payment-microservice/
├── http-api-gateway/       # API Gateway Service
├── payment-microservices/  # Payment Service
├── user-microservices/     # User Service
├── .vscode/                # VS Code specific settings (e.g., launch.json)
├── docker-compose.yml      # Docker Compose configuration for all services
├── README.md               # This file
└── .gitignore              # Global gitignore
```

## Prerequisites

*   Node.js (v18+ recommended, check `.nvmrc` or `package.json` engines if present)
*   pnpm (install via `npm install -g pnpm`)
*   Docker Desktop (or Docker Engine + Docker Compose)

## Getting Started

### Environment Configuration

Each microservice might require its own `.env` file for local development if not using Docker environment variables directly. Refer to the `docker-compose.yml` for required environment variables (e.g., database credentials, NATS URL, service ports).

For Docker Compose, environment variables are primarily set within the `docker-compose.yml` file. **Ensure you update placeholder credentials in `docker-compose.yml` before the first run.**

### Running with Docker Compose

This is the recommended way to run all services together for development or testing.

1.  **Clone the repository (if you haven't already):**
    ```bash
    git clone <your-repository-url>
    cd social-payment-microservice
    ```

2.  **Review and update `docker-compose.yml`:**
    *   Pay special attention to database passwords (`MYSQL_ROOT_PASSWORD`, `DB_PASSWORD`) and any other sensitive or environment-specific configurations.

3.  **Build and start all services:**
    ```bash
    docker-compose up --build
    ```
    *   The `--build` flag forces Docker to rebuild the images. You can omit it on subsequent runs if no code changes requiring a rebuild have been made.
    *   Services will be accessible on their mapped ports (see `docker-compose.yml`).

4.  **Accessing Services:**
    *   **API Gateway**: `http://localhost:3000` (or as configured)
    *   **Swagger API Docs**: `http://localhost:3000/api-docs`
    *   **NATS Monitoring**: `http://localhost:8222` (if enabled and exposed)
    *   Individual microservices are typically not accessed directly from the outside but communicate via NATS or through the gateway.

5.  **To stop all services:**
    ```bash
    docker-compose down
    ```
    *   To remove volumes (like database data): `docker-compose down -v`

### Running Services Individually (Development)

If you prefer to run services outside of Docker during development:

1.  **Navigate to the service directory:**
    ```bash
    cd http-api-gateway
    # or cd user-microservices, cd payment-microservices
    ```

2.  **Install dependencies:**
    ```bash
    pnpm install
    ```

3.  **Set up `.env` file:**
    Create a `.env` file in the service's root directory with necessary environment variables (e.g., `NATS_URL=nats://localhost:4222`, `DB_HOST=localhost`, `DB_PORT=3306`, etc.). You'll need a NATS server and MySQL database running locally or accessible.

4.  **Run the development server:**
    ```bash
    pnpm run start:dev
    ```

Repeat for each microservice you want to run. Ensure your local NATS and MySQL instances are running and configured correctly.

## API Documentation

API documentation for the HTTP API Gateway is provided by Swagger. Once the gateway is running (either via Docker Compose or individually), you can access it at:
`http://localhost:3000/api-docs`

## Key Features

*   **Microservice Architecture**: Demonstrates separation of concerns and independent scalability.
*   **Asynchronous Communication**: Utilizes NATS for event-driven and message-based communication between services.
*   **RESTful API Gateway**: Provides a unified interface for client applications.
*   **Database per Service (Pattern)**: Each service can manage its own database schema (though this example uses shared DB credentials for simplicity in Docker Compose, in a production scenario, each service might have its own DB instance or schema with distinct credentials).
*   **Containerized Deployment**: Docker and Docker Compose for easy setup and consistent environments.
*   **Request Validation**: DTOs and `ValidationPipe` for robust input validation.
*   **ORM**: TypeORM for database interactions.

## Directory Structure (High-Level)

```
.
├── http-api-gateway        # Handles incoming HTTP requests, routes to other services
│   ├── src
│   ├── Dockerfile
│   └── .dockerignore
├── payment-microservices   # Manages payment logic
│   ├── src
│   ├── Dockerfile
│   └── .dockerignore
├── user-microservices      # Manages user authentication and data
│   ├── src
│   ├── Dockerfile
│   └── .dockerignore
├── .vscode                 # VSCode specific configurations (launch.json for debugging)
├── docker-compose.yml      # Orchestrates all services for Docker deployment
└── README.md
```

---
