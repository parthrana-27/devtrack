# DevTrack
A production-ready, enterprise-grade issue tracking and project management platform built with React + Vite, Java/Spring Boot, PostgreSQL, Redis, and Apache Kafka.

## Table of Contents
- [Overview](#overview)
- [Key Features](#key-features)
- [System Design](#system-design)
- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Database Schema & Design Decisions](#database-schema--design-decisions)
- [Backend Architecture](#backend-architecture)
- [Frontend Architecture](#frontend-architecture)
- [Caching Strategy (Redis)](#caching-strategy-redis)
- [Event-Driven Flow (Kafka)](#event-driven-flow-kafka)
- [Authentication Flow](#authentication-flow)
- [API Reference](#api-reference)
- [Environment Variables](#environment-variables)
- [Quick Start (Docker Compose)](#quick-start-docker-compose)
- [Local Development](#local-development)
- [Running Tests](#running-tests)

---

## Overview
DevTrack is a full-stack project management platform that simulates real-world Agile workflows similar to Jira or GitHub Issues. It allows multi-tenant organizations to create projects, manage teams, assign issues, track sprints, and analyze project performance using a Kanban board and interactive analytics.

### Key Features
- **Project & Issue Management** — Create projects, manage epics, features, and bugs.
- **Interactive Kanban Board** — Drag-and-drop issues between workflow states using `@hello-pangea/dnd`.
- **Sprint Management** — Group issues into time-boxed agile sprints and track velocity.
- **Role-Based Auth** — Granular permissions for Admins, Project Managers, and Developers via JWTs.
- **Analytics Dashboard** — Visual representation of project health, overdue issues, and team velocity using `recharts`.
- **Real-Time Event Bus** — Kafka-powered event dispatching for background notifications.
- **High-Performance Caching** — Sub-millisecond response caching using Redis for active projects and issue lists.

---

## System Design & Architecture
DevTrack employs a decoupled, highly scalable layered architecture.

```text
┌────────────────────────────────────────────────────────┐
│                   FRONTEND CLIENT                      │
│   ┌─────────────────┐       ┌─────────────────┐        │
│   │   React/Vite    │       │  Kanban Board   │        │
│   │  Tailwind CSS   │       │ (@hello-pangea) │        │
│   └─────────────────┘       └─────────────────┘        │
└───────────────────────────┬────────────────────────────┘
                            │ (REST API / JSON)
                            ▼
┌────────────────────────────────────────────────────────┐
│                  BACKEND API SERVER                    │
│   ┌────────────────────────────────────────────────┐   │
│   │              Spring Boot Application           │   │
│   │  ┌─────────────┐   ┌───────────┐  ┌──────────┐ │   │
│   │  │ Controllers │   │ Services  │  │ Security │ │   │
│   │  └──────┬──────┘   └─────┬─────┘  └──────────┘ │   │
│   └─────────┼────────────────┼─────────────────────┘   │
└─────────────┼────────────────┼─────────────────────────┘
      (JPA/Hibernate)          │ (Redis Template)
              ▼                ▼
┌────────────────────────┐  ┌─────────────────────────────┐
│    DATABASE STORAGE    │  │    IN-MEMORY DATA STORE     │
│       PostgreSQL       │  │           Redis             │
│  ┌──────────────────┐  │  │  ┌───────────────────────┐  │
│  │ Users, Projects, │  │  │  │ Project & Issue Cache │  │
│  │ Issues, Sprints  │  │  │  │ (Tenant Isolated)     │  │
│  └──────────────────┘  │  │  └───────────────────────┘  │
└────────────────────────┘  └─────────────────────────────┘
                               ▲
┌──────────────────────────────┼─────────────────────────┐
│       ASYNC EVENT BUS (APACHE KAFKA)                   │
│   Topics: issue-events, sprint-events                  │
└────────────────────────────────────────────────────────┘
```

---

## Tech Stack
- **Backend:** Java 21+, Spring Boot 3.x, Hibernate/JPA, Spring Security (JWT)
- **Frontend:** React 18, Vite, TypeScript, Tailwind CSS, React Router, Recharts
- **Databases:** PostgreSQL (Relational), Redis (Cache)
- **Message Broker:** Apache Kafka (Event streaming)
- **DevOps:** Docker, Docker Compose, Maven

---

## Project Structure
```text
devtrack/
├── pom.xml                     # Maven configuration
├── docker-compose.yml          # Container orchestrator
├── src/main/java/com/devtrack/ # Spring Boot Backend
│   ├── config/                 # Redis, Kafka, Security configs
│   ├── controller/             # REST API Controllers
│   ├── dto/                    # Data Transfer Objects
│   ├── entity/                 # JPA Entities
│   ├── exception/              # Global Error Handlers
│   ├── messaging/              # Kafka Producers & Consumers
│   ├── repository/             # Spring Data JPA Repositories
│   ├── scheduler/              # Cron Jobs (Overdue checks)
│   ├── security/               # JWT Filters & Auth Providers
│   └── service/                # Business Logic (Impl)
├── frontend/                   # React SPA Client
│   ├── index.html
│   ├── vite.config.ts
│   ├── tailwind.config.js
│   ├── src/
│   │   ├── components/         # Shared UI (Sidebar, Layout)
│   │   ├── context/            # AuthContext
│   │   ├── pages/              # Views (Dashboard, Kanban)
│   │   └── services/           # Axios Interceptors
└── README.md
```

---

## Database Schema & Design Decisions

DevTrack uses **PostgreSQL** via Spring Data JPA with a robust schema mapping:
- **User & Organization**: Multi-tenant structure. Organizations own Projects; Users belong to Organizations with specific Roles.
- **Projects & Issues**: Issues are uniquely tied to Projects via `projectId` and hold relationships to a `User` (Assignee). 
- **Audit Logs**: A separate immutable table tracks critical state transitions (e.g., Issue status changed to DONE) mapped via `AuditLogService`.

**Performance Decisions:**
- Addressed N+1 query problems using JPA Entity Graphs and specific `@Query(fetch)` declarations.
- Utilized `JpaSpecificationExecutor` to dynamically construct SQL clauses for Advanced Search filters.

---

## Backend Architecture

1. **Layered Pattern**: Controllers extract payloads, Services contain business logic, and Repositories handle data access. Business logic is strictly kept out of Controllers.
2. **Concurrency**: The `AnalyticsService` executes multi-faceted dashboard aggregation queries concurrently via `CompletableFuture.supplyAsync()` to a custom Executor thread pool, collapsing latency.
3. **Schedulers**: `@Scheduled` tasks automatically scan the database at midnight to flag overdue issues.

---

## Frontend Architecture

- **State Management**: Built on React 18, utilizing the Context API (`AuthContext`) for global session state and React Router for view navigation.
- **Security**: The JWT `access_token` is injected transparently into all outbound requests via an Axios interceptor.
- **Kanban Engine**: Features `@hello-pangea/dnd` for smooth, performant drag-and-drop interactions to change issue statuses.
- **Visuals**: Tailwind CSS handles utility styling, while `recharts` renders the data-heavy analytics dashboard.

---

## Caching Strategy (Redis)

To guarantee sub-millisecond response times for heavy operations:
- **Cache-Aside Pattern**: Spring Cache abstraction (`@Cacheable`, `@CachePut`, `@CacheEvict`).
- **Tenant Isolation**: Cache keys are structured as `#issueId + '-' + #currentUserEmail` to ensure cross-tenant data leakage is structurally impossible.
- **Serializer**: Uses JSON Redis serializers to ensure the cached payload is readable and platform-agnostic.

---

## Event-Driven Flow (Kafka)

When an Issue is created or its state changes (e.g., `TODO` -> `DONE`), the main thread is not blocked by sending emails or generating reports.
- `IssueServiceImpl` publishes an `IssueEvent` to the `issue-events` Kafka topic.
- The `KafkaConsumerService` pulls from the topic to process the side effects asynchronously.

---

## Authentication Flow

1. Client POSTs `/api/auth/login` with email and password.
2. Spring Security `AuthenticationManager` verifies the credentials against the BCrypt hashed DB password.
3. `JwtTokenProvider` generates an `access_token` containing the User ID, Role, and expiration.
4. The React client stores the token in `localStorage` and appends it as `Bearer <token>` in the Axios interceptor.
5. `JwtAuthenticationFilter` validates the signature on every subsequent request and constructs the `SecurityContext`.

---

## API Reference

### Auth
| Method | Endpoint | Body | Returns |
|--------|----------|------|---------|
| POST | `/api/auth/register` | `{ email, password, name }` | `{ user }` |
| POST | `/api/auth/login` | `{ email, password }` | `{ access_token }` |

### Issues
| Method | Endpoint | Body/Query | Returns |
|--------|----------|------------|---------|
| POST | `/api/issues` | `{ projectId, title, type }` | `{ issue }` |
| PUT | `/api/issues/{id}` | `{ status, assigneeId }` | `{ issue }` |
| POST | `/api/issues/project/{id}/search` | `{ status, assignee, priority }` | `{ Page<Issue> }` |

### Analytics
| Method | Endpoint | Body/Query | Returns |
|--------|----------|------------|---------|
| GET | `/api/projects/{id}/analytics` | `-` | `{ total, completed, open, overdue }` |

---

## Environment Variables

The backend relies on the `application.yml` which can be overridden via environment variables:

| Variable | Default | Description |
|----------|---------|-------------|
| `SPRING_DATASOURCE_URL` | `jdbc:postgresql://localhost:5432/devtrack` | Postgres connection string |
| `SPRING_REDIS_HOST` | `localhost` | Redis server host |
| `SPRING_KAFKA_BOOTSTRAP_SERVERS`| `localhost:9092` | Kafka broker URL |
| `JWT_SECRET` | *(Needs config)* | 64-char string for HMAC signing |

---

## Quick Start (Docker Compose)

The easiest way to get the infrastructure running is via Docker Compose.

```bash
# 1. Clone the repo
git clone <repo-url>
cd devtrack

# 2. Start PostgreSQL, Redis, and Kafka
docker-compose up -d

# 3. Start the Spring Boot Backend (Runs on http://localhost:8080)
./mvnw spring-boot:run

# 4. Open a new terminal and start the Frontend (Runs on http://localhost:5173)
cd frontend
npm install
npm run dev
```

---

## Local Development (Without Docker)

If you prefer to run services manually:
1. Ensure PostgreSQL is running on port `5432` with a database named `devtrack`.
2. Ensure Redis is running on port `6379`.
3. Ensure Zookeeper and Kafka are running on ports `2181` and `9092`.
4. Run the Spring backend using your IDE or `./mvnw spring-boot:run`.

---

## Running Tests

```bash
# Backend unit & integration tests
./mvnw test
```
Tests cover JWT validation, database queries, Service business logic, and Controller endpoints via `MockMvc`.

---
*DevTrack — Empowering agile teams with enterprise-grade tooling.*
