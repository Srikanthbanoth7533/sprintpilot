# 🏛️ SprintPilot System Architecture & Design Specification

This document details the architectural design, security model, data topologies, and engineering trade-offs of the **SprintPilot** platform.

---

## 1. System Overview & Component Topology

SprintPilot is architectured as a decoupled, single-tenant SaaS application separating client presentation from business orchestration and persistence:

```mermaid
graph TD
    Client[React 18 Single Page App<br/>Vite / Tailwind / Recharts] -->|HTTPS REST + Bearer JWT| Gateway[Spring Security Gateway Filter]
    Gateway -->|Authentication / Claims Extraction| Context[SecurityContextHolder]
    Context --> Dispatcher[Spring MVC DispatcherServlet]
    
    Dispatcher --> AuthCtrl[AuthController]
    Dispatcher --> ProductCtrl[ProductController]
    Dispatcher --> SprintCtrl[SprintController]
    Dispatcher --> StoryCtrl[StoryController]
    Dispatcher --> AnalyticsCtrl[AnalyticsController]
    Dispatcher --> AiCtrl[AiAssistantController]

    ProductCtrl --> ProductSvc[ProductService]
    SprintCtrl --> SprintSvc[SprintService]
    StoryCtrl --> StorySvc[StoryService]
    AnalyticsCtrl --> AnalyticsSvc[AnalyticsService]
    AiCtrl --> AiSvc[AiAssistantService]

    ProductSvc --> Repos[Spring Data JPA Repositories]
    SprintSvc --> Repos
    StorySvc --> Repos
    AnalyticsSvc --> Repos

    AiSvc -->|Primary| OpenAI[OpenAI ChatCompletion API]
    AiSvc -->|Offline Fallback| RegexNLP[Rule-Based Agile Heuristic Engine]

    Repos -->|Hibernate 6 / HikariCP| Database[(PostgreSQL 16 / H2 Dev)]
```

---

## 2. Authentication & Authorization Lifecycle

SprintPilot employs **Stateless JSON Web Tokens (JWT)** with HMAC-SHA256 signature verification.

```mermaid
sequenceDiagram
    autonumber
    actor User as User / Browser
    participant App as React Axios Interceptor
    participant Filter as AuthTokenFilter
    participant Provider as JwtUtils
    participant Service as UserDetailsServiceImpl
    participant API as Protected REST Controller
    participant DB as Database

    User->>App: Submits Email & Password
    App->>API: POST /api/auth/login {email, password}
    API->>Service: loadUserByUsername(email)
    Service->>DB: Query user by email
    DB-->>Service: User record + BCrypt hash
    Service-->>API: UserDetails
    API->>API: BCrypt.checkpw(rawPassword, hash)
    API->>Provider: generateJwtToken(authentication)
    Provider-->>API: JWT Token (claims: sub, roles, exp)
    API-->>App: 200 OK {token, user}
    App->>App: Store token in localStorage

    Note over User,DB: Subsequent Authenticated Requests
    User->>App: Navigates to /sprints/active
    App->>Filter: GET /api/sprints/active [Header: Bearer eyJhbG...]
    Filter->>Provider: validateJwtToken(token)
    Provider-->>Filter: Valid = true
    Filter->>Provider: getUserNameFromJwtToken(token)
    Provider-->>Filter: "elena.rostova@sprintpilot.demo"
    Filter->>Service: loadUserByUsername(email)
    Service-->>Filter: UserDetails (with Authorities)
    Filter->>Filter: Set SecurityContextHolder.setAuthentication(...)
    Filter->>API: Forward request to Controller
    API->>API: Evaluate @PreAuthorize("hasRole('ROLE_DEVELOPER') or ...")
    API->>DB: Query active sprint & stories
    DB-->>API: Data Entities
    API-->>App: 200 OK [JSON Response]
```

### Role-Based Access Control Matrix

| Controller / Action | Method | Required Roles | Rationale |
| :--- | :--- | :--- | :--- |
| Create Product | `POST /api/products` | `ROLE_ADMIN`, `ROLE_PRODUCT_MANAGER` | Product roadmaps require strategic management privileges. |
| Create Sprint | `POST /api/sprints` | `ROLE_ADMIN`, `ROLE_PRODUCT_MANAGER` | Sprints represent delivery commitments scheduled by PMs. |
| Move Story Status | `PUT /api/stories/{id}/status` | `ROLE_ADMIN`, `ROLE_PRODUCT_MANAGER`, `ROLE_DEVELOPER` | Engineers actively driving work update Kanban status. |
| Log / Resolve Blocker | `POST /api/stories/{id}/blocker` | `ROLE_ADMIN`, `ROLE_PRODUCT_MANAGER`, `ROLE_DEVELOPER` | Any team member executing can raise an impediment. |
| View Analytics | `GET /api/analytics/dashboard` | `ROLE_ADMIN`, `ROLE_PRODUCT_MANAGER`, `ROLE_DEVELOPER`, `ROLE_VIEWER` | Read-only visibility granted to all organizational stakeholders. |

---

## 3. Data Model & Entity Relationship Architecture

```mermaid
erDiagram
    USERS ||--o{ PRODUCTS : "owns / leads"
    USERS ||--o{ USER_STORIES : "assigned_to"
    USERS ||--o{ COMMENTS : "authored"
    
    PRODUCTS ||--o{ REQUIREMENTS : "defines"
    PRODUCTS ||--o{ SPRINTS : "contains"
    PRODUCTS ||--o{ RELEASES : "ships"

    REQUIREMENTS ||--o{ USER_STORIES : "decomposed_into"
    SPRINTS ||--o{ USER_STORIES : "executes"
    RELEASES ||--o{ USER_STORIES : "delivers"

    USER_STORIES ||--o{ TASKS : "broken_down_into"
    USER_STORIES ||--o{ COMMENTS : "discussed_in"
    USER_STORIES ||--o| BLOCKERS : "hindered_by"

    USERS {
        uuid id PK
        string full_name
        string email UK
        string password_hash
        string role
        string avatar_url
    }

    PRODUCTS {
        uuid id PK
        string name
        string key UK
        string description
        string status
        uuid owner_id FK
    }

    SPRINTS {
        uuid id PK
        string name
        date start_date
        date end_date
        string status
        int committed_points
        int completed_points
        uuid product_id FK
    }

    USER_STORIES {
        uuid id PK
        string key UK
        string title
        text description
        text acceptance_criteria
        int story_points
        int business_value
        int customer_impact
        int urgency
        int technical_complexity
        double priority_score
        string status
        string priority
        uuid sprint_id FK
        uuid assignee_id FK
    }

    BLOCKERS {
        uuid id PK
        string reason
        string status
        timestamp flagged_at
        timestamp resolved_at
        uuid story_id FK
    }
```

---

## 4. State Machines

### Sprint Lifecycle
```
[PLANNING] ──(startSprint)──> [ACTIVE] ──(completeSprint)──> [COMPLETED]
                                  │
                             (cancelSprint)
                                  ▼
                             [CANCELLED]
```
- **Constraint**: Only one sprint may be in `ACTIVE` state per product at any given time.
- **Completion Hook**: When a sprint moves to `COMPLETED`, all stories remaining in non-`DONE` status automatically return to the product backlog (`sprint_id = null`).

### User Story Kanban Lifecycle
```
[BACKLOG] ──(assign to active sprint)──> [IN_PROGRESS] ──(code review)──> [IN_REVIEW] ──(QA verified)──> [DONE]
    ▲                                          │                                │
    └──────────────────(reject/reopen)─────────┴────────────────────────────────┘
```

---

## 5. Engineering Trade-offs & Design Decisions

### 1. In-Memory H2 (Dev) vs PostgreSQL (Prod)
- **Decision**: Configured dual Spring profiles (`application-dev.properties` with H2 PostgreSQL mode vs `application-prod.properties`).
- **Trade-off**: Evaluators reviewing the repository locally can clone and launch immediately without configuring local database servers or credentials. Production configurations use PostgreSQL's native JSONB, connection pooling, and ACID guarantees.

### 2. Dual-Engine AI Assistant Architecture
- **Decision**: Implemented `AiAssistantService` with automatic heuristic regex fallback.
- **Trade-off**: External LLM APIs (OpenAI) can fail due to rate limits, expired keys, or latency. SprintPilot's offline NLP fallback extracts roles, actions, benefits, and Gherkin structures instantaneously without network calls, ensuring 100% demo reliability.

### 3. Stateless JWT vs Server-Side HTTP Sessions
- **Decision**: Stateless JWT tokens stored client-side in localStorage and transmitted via Authorization headers.
- **Trade-off**: Eliminates memory state on the backend, allowing horizontal scalability across containers without distributed session stores (Redis). Token invalidation relies on short expiration times (24h) and revocation lists for high-security environments.

### 4. Client-Side Mathematical Prioritization Previews
- **Decision**: Priority scores are computed both client-side (during story authoring slider adjustments) and recalculated server-side in the service layer.
- **Trade-off**: Provides instant visual feedback to product managers on the formula output without network round-trips, while the backend guarantees data integrity before committing to PostgreSQL.
