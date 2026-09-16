<div align="center">

# 🚀 SprintPilot
### AI-Assisted Product & Engineering Management SaaS Platform

[![Spring Boot 3](https://img.shields.io/badge/Spring%20Boot-3.4.3-brightgreen.svg)](https://spring.io/projects/spring-boot)
[![Java 17](https://img.shields.io/badge/Java-17-orange.svg)](https://www.oracle.com/java/)
[![React 18](https://img.shields.io/badge/React-18-blue.svg)](https://reactjs.org/)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-16-blue.svg)](https://www.postgresql.org/)
[![Tailwind CSS](https://img.shields.io/badge/TailwindCSS-3.4-cyan.svg)](https://tailwindcss.com/)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](LICENSE)

*A full-stack, enterprise-grade agile execution engine bridging product strategy and sprint delivery.*

[Live Demo](#) · [API Documentation (Swagger)](#api-documentation) · [Architecture Guide](ARCHITECTURE.md) · [Interview Preparation](INTERVIEW_GUIDE.md)

</div>

---

## 📌 Executive Summary

Modern software organizations struggle with the disconnect between high-level product strategy and low-level sprint execution. Requirements live in Notion, backlogs are buried in Jira, velocity is tracked in spreadsheets, and PRDs take hours to translate into actionable engineering stories.

**SprintPilot** unifies this lifecycle into a high-performance, single-tenant SaaS application. It combines:
1. **Strategic Product Hierarchy**: Products $\to$ Requirements $\to$ User Stories $\to$ Tasks $\to$ Releases.
2. **Deterministic Priority Scoring**: A mathematical prioritization formula balancing Business Value, Customer Impact, Urgency, and Technical Complexity.
3. **Interactive Agile Execution**: Real-time Kanban board with drag-and-drop state transitions, blocker flags, and sprint burndown tracking.
4. **Authentic Product Analytics**: Live calculation of team velocity, sprint completion percentages, role-based workload distribution, and blocker resolution cycle times.
5. **AI Agile Assistant**: Generates structured User Stories and Gherkin Acceptance Criteria (`Given-When-Then`) from raw product prompts, with an automated offline heuristic fallback guaranteeing 100% demo uptime.

---

## 🏗️ System Architecture & Technology Stack

```
                                      ┌─────────────────────────────────┐
                                      │        React 18 Frontend        │
                                      │   Vite + TailwindCSS + Recharts │
                                      └────────────────┬────────────────┘
                                                       │ HTTPS / REST (JSON)
                                                       │ Bearer JWT
                                                       ▼
                                      ┌─────────────────────────────────┐
                                      │    Spring Boot 3.4.3 Backend    │
                                      │       Java 17 Enterprise        │
                                      └───────┬──────────────┬──────────┘
                                              │              │
                       ┌──────────────────────▼──────┐       │
                       │   Spring Security Filter    │       │
                       │   - Stateless JWT Validator │       │
                       │   - Role-Based Auth (RBAC)  │       │
                       └──────────────┬──────────────┘       │
                                      │                      ▼
                       ┌──────────────▼──────────────┐ ┌───────────────┐
                       │    JPA / Hibernate ORM      │ │  AI Engine    │
                       │ Spring Data Repositories    │ │ - OpenAI API  │
                       └──────────────┬──────────────┘ │ - NLP Heuristic│
                                      │                └───────────────┘
                                      ▼
                       ┌─────────────────────────────┐
                       │     PostgreSQL 16 Engine    │
                       │ (H2 compatibility in dev)   │
                       └─────────────────────────────┘
```

### Backend
- **Framework**: Spring Boot 3.4.3 (Java 17 LTS)
- **Security**: Spring Security 6 with stateless JWT (`jjwt 0.12.6`), BCrypt password hashing, and granular `@PreAuthorize` method security.
- **Persistence**: Spring Data JPA / Hibernate 6 with optimized indexed queries (`@Entity`, `@ManyToOne`, `@OneToMany`).
- **Database**: PostgreSQL 16 (production), H2 in PostgreSQL compatibility mode (zero-setup development).
- **Validation**: Jakarta Bean Validation (`@NotNull`, `@NotBlank`, `@Size`, `@Min`, `@Max`).
- **Documentation**: Springdoc OpenAPI 3.0 / Swagger UI.

### Frontend
- **Framework**: React 18 with Vite build tooling.
- **Styling**: Tailwind CSS 3.4 with custom enterprise dark/light theme tokens and glassmorphism accents.
- **Icons**: Lucide React.
- **Charts & Visualization**: Recharts (Sprint Velocity, Story Point Burndown, Workload Distribution).
- **HTTP Client**: Axios with automatic JWT request interceptors and 401 response handling.

---

## 🔑 Key Features & Engineering Highlights

### 1. Mathematical Prioritization Scoring Formula
Backlog grooming often degenerates into subjective debate. SprintPilot implements a deterministic priority algorithm:

$$\text{Priority Score} = (\text{Business Value} \times 1.5) + (\text{Customer Impact} \times 1.2) + (\text{Urgency} \times 1.0) - (\text{Technical Complexity} \times 0.8)$$

- Inputs are rated on a normalized 1–10 scale.
- Scores dynamically re-rank backlogs to maximize engineering ROI per sprint cycle.

### 2. Role-Based Access Control (RBAC)
Four distinct persona roles enforce principle-of-least-privilege security:
- **`ROLE_ADMIN`**: Full platform oversight, user role management, system settings.
- **`ROLE_PRODUCT_MANAGER`**: Create/edit products, requirements, user stories, releases, and start sprints.
- **`ROLE_DEVELOPER`**: Update story statuses on the Kanban board, log blockers, resolve tasks, and add comments.
- **`ROLE_VIEWER`**: Read-only access to dashboards, releases, and roadmap metrics.

### 3. Real-Time Kanban Execution & Blocker Engine
- Four-column agile workflow: **Backlog**, **In Progress**, **In Review**, **Done**.
- One-click drag/move transitions that recalculate sprint metrics synchronously in PostgreSQL.
- Flag stories with blockers (recording reason and timestamp); blockers immediately tint cards and highlight on the executive dashboard.

### 4. Enterprise Product Analytics (Zero Fake Metrics)
Every metric displayed in SprintPilot is derived directly from relational database aggregation queries:
- **Average Velocity**: Moving average of completed story points across past closed sprints.
- **Sprint Completion Rate**: $\frac{\text{Completed Points}}{\text{Committed Points}} \times 100\%$.
- **Workload Allocation**: Grouped user story commitments per developer to prevent team burnout.
- **Active Blockers Count**: Real-time counter of unresolved impediments.

### 5. AI Story & Acceptance Criteria Generator
- Translates unstructured feature descriptions into industry-standard agile stories:
  - Format: *"As a [persona], I want [capability] so that [business benefit]."*
  - Generates Gherkin Acceptance Criteria (`Given`, `When`, `Then`).
  - Estimates Fibonacci story points (1, 2, 3, 5, 8, 13) and recommends technical labels.
- **Dual Engine Architecture**: Invokes OpenAI GPT if `OPENAI_API_KEY` is configured; otherwise automatically falls back to an offline rule-based NLP extraction engine. **Guarantees zero downtime during live demonstrations.**

---

## 🧑‍💻 Demo Persona Accounts

The application automatically seeds realistic demo data on startup. You can switch between personas on the login page with one click:

| Persona | Email | Password | Role | Permissions |
| :--- | :--- | :--- | :--- | :--- |
| **Sarah Chen** | `admin@sprintpilot.demo` | `DemoPassword123!` | `ROLE_ADMIN` | Full System Administration |
| **Elena Rostova** | `product@sprintpilot.demo` | `DemoPassword123!` | `ROLE_PRODUCT_MANAGER` | Backlog, Requirements, Sprints, Releases |
| **Alex Rivera** | `developer@sprintpilot.demo` | `DemoPassword123!` | `ROLE_DEVELOPER` | Kanban, Tasks, Blockers, Comments |
| **David Park** | `viewer@sprintpilot.demo` | `DemoPassword123!` | `ROLE_VIEWER` | Read-only Analytics & Roadmap |

---

## ⚡ Quick Start & Local Setup

### Prerequisites
- Java 17+ LTS installed (`java -version`)
- Node.js 18+ and npm installed (`node -v`)
- Git installed

### Option A: Running with Maven & Vite (Fastest Development)

1. **Clone the repository**:
   ```bash
   git clone https://github.com/Srikanthbanoth7533/sprintpilot.git
   cd sprintpilot
   ```

2. **Start Backend (Spring Boot)**:
   ```bash
   cd backend
   # On Windows:
   .\mvnw.cmd spring-boot:run
   # On Linux/macOS:
   ./mvnw spring-boot:run
   ```
   *The backend starts at `http://localhost:8080` with in-memory H2 database pre-seeded with full demo data.*

3. **Start Frontend (React + Vite)**:
   ```bash
   cd ../frontend
   npm install
   npm run dev
   ```
   *The frontend starts at `http://localhost:5173` (with `/api` automatically proxied to `:8080`).*

4. Open browser to **`http://localhost:5173`** and click any demo button to log in!

---

### Option B: Running with Docker Compose (Production Stack)

Orchestrates PostgreSQL 16, the Spring Boot container, and Nginx React container in one command:

```bash
docker-compose up --build
```

- Web UI: `http://localhost:3000`
- REST API: `http://localhost:8080/api`
- Swagger UI: `http://localhost:8080/swagger-ui.html`

---

## 📡 REST API Documentation

SprintPilot exposes a fully documented OpenAPI 3.0 specification accessible at `http://localhost:8080/swagger-ui.html`.

### Key Endpoints Summary

| Method | Endpoint | Description | Required Role |
| :--- | :--- | :--- | :--- |
| `POST` | `/api/auth/login` | Authenticate user & receive JWT token | Public |
| `POST` | `/api/auth/register` | Register new user account | Public |
| `GET` | `/api/auth/me` | Fetch authenticated user profile | Authenticated |
| `GET` | `/api/products` | List all managed products | Viewer+ |
| `POST` | `/api/products` | Create a new product | Product Manager+ |
| `GET` | `/api/products/{id}/backlog` | Retrieve backlog user stories | Viewer+ |
| `POST` | `/api/stories` | Create user story with priority metrics | Product Manager+ |
| `PUT` | `/api/stories/{id}/status` | Move story on Kanban board | Developer+ |
| `POST` | `/api/stories/{id}/blocker` | Flag story with blocker | Developer+ |
| `DELETE`| `/api/stories/{id}/blocker` | Resolve story blocker | Developer+ |
| `GET` | `/api/sprints/active` | Get currently active sprint with stories | Viewer+ |
| `POST` | `/api/sprints/{id}/start` | Transition sprint from PLANNING to ACTIVE | Product Manager+ |
| `POST` | `/api/sprints/{id}/complete`| Close sprint and archive completed points | Product Manager+ |
| `GET` | `/api/analytics/dashboard` | Aggregated executive metrics & velocity | Viewer+ |
| `POST` | `/api/ai/generate-story` | Generate story & criteria from prompt | Product Manager+ |

---

## 🧪 Testing & Quality Assurance

### Running Backend Unit & Integration Tests
SprintPilot includes comprehensive automated tests covering authentication, prioritization logic, and AI fallback generation:

```bash
cd backend
.\mvnw.cmd test
```

Test Suites:
- `AuthControllerIntegrationTest`: Validates authentication flows, bad credential rejections, and JWT token issuance.
- `PrioritizationTest`: Verifies the mathematical prioritization formula against boundary conditions.
- `AiAssistantServiceTest`: Confirms both OpenAI execution and offline heuristic regex parsing.

### Running Frontend Production Build
```bash
cd frontend
npm run build
```
*Compiles Vite bundle and runs PostCSS/Tailwind tree-shaking with zero lint errors.*

---

## 📁 Repository Structure

```
sprintpilot/
├── .github/
│   └── workflows/
│       └── ci.yml                 # Automated CI/CD pipeline (tests, build, artifact packaging)
├── backend/
│   ├── src/main/java/com/sprintpilot/
│   │   ├── config/                # Security, JWT, Swagger, and WebMvc configuration
│   │   ├── controller/            # REST API endpoints (Auth, Product, Sprint, Backlog, AI, Analytics)
│   │   ├── dto/                   # Request & Response data transfer objects
│   │   ├── entity/                # JPA entities (Product, Requirement, Sprint, Story, Blocker, User)
│   │   ├── exception/             # Global exception handler & custom error responses
│   │   ├── repository/            # Spring Data JPA repositories with custom query methods
│   │   ├── security/              # UserDetailsService, AuthTokenFilter, and JwtUtils
│   │   ├── seeder/                # DataSeeder initializing realistic enterprise demo data
│   │   └── service/               # Core business logic (Prioritization, Sprints, AI engine)
│   ├── src/main/resources/
│   │   ├── application.properties # Base configuration
│   │   ├── application-dev.properties  # H2 in-memory dev profile
│   │   └── application-prod.properties # PostgreSQL production profile
│   ├── Dockerfile                 # Multi-stage Eclipse Temurin 17 build
│   └── pom.xml                    # Maven dependencies
├── frontend/
│   ├── src/
│   │   ├── components/            # Reusable UI components (Navbar, Sidebar, Modals, KanbanColumn)
│   │   ├── context/               # React Contexts (AuthContext, ToastContext, ProductContext)
│   │   ├── pages/                 # Full feature views (Dashboard, Backlog, Board, Analytics, AI)
│   │   ├── services/              # Axios API service layer (JWT interceptors, endpoint bindings)
│   │   ├── App.jsx                # Route declarations & ProtectedRoute wrappers
│   │   └── index.css              # Tailwind CSS imports & custom utility classes
│   ├── Dockerfile                 # Multi-stage Node 20 + Nginx Alpine build
│   ├── nginx.conf                 # Production Nginx reverse proxy & SPA router
│   ├── package.json               # Frontend dependencies & scripts
│   └── vite.config.js             # Vite development server & proxy config
├── docker-compose.yml             # Multi-container orchestration (PostgreSQL + API + UI)
├── .env.example                   # Environment configuration template
├── ARCHITECTURE.md                # In-depth architectural design & trade-off documentation
├── INTERVIEW_GUIDE.md             # 20 technical interview questions & detailed answers
└── RESUME_DESCRIPTION.md          # Tailored resume bullet points for NxtPe internship application
```

---

## 🚢 Production Deployment Guide

### Deploying Backend to Render / Railway / AWS
1. Create a managed **PostgreSQL** instance.
2. Set Environment Variables:
   - `SPRING_PROFILES_ACTIVE=prod`
   - `SPRING_DATASOURCE_URL=jdbc:postgresql://<HOST>:<PORT>/<DB_NAME>`
   - `SPRING_DATASOURCE_USERNAME=<DB_USER>`
   - `SPRING_DATASOURCE_PASSWORD=<DB_PASS>`
   - `APP_JWT_SECRET=<STRONG_256_BIT_SECRET>`
   - `APP_CORS_ALLOWED_ORIGINS=https://your-frontend-domain.vercel.app`
3. Deploy the Dockerfile from `/backend` or use Native Java 17 buildpack.

### Deploying Frontend to Vercel / Netlify
1. Set Root Directory to `frontend`.
2. Build Command: `npm run build`.
3. Output Directory: `dist`.
4. Environment Variable:
   - `VITE_API_BASE_URL=https://your-backend-api.onrender.com/api`

---

## 📜 License

SprintPilot is open-source software licensed under the [MIT License](LICENSE).
