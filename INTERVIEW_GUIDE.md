# 🎯 SprintPilot Technical Interview Guide: 20 Core Engineering Questions

This document prepares you for technical interviews at high-bar engineering companies like **NxtPe**. It breaks down the 20 fundamental design, architecture, and code questions about SprintPilot with production-grade depth.

---

### 1. Explain the complete architecture of SprintPilot from request to database.
**Answer:**
SprintPilot follows a layered, decoupled client-server architecture:
1. **Presentation Layer (React 18 + Vite)**: Handles user interaction, client-side route guards (`ProtectedRoute`), and optimistic UI updates. API requests are dispatched via an Axios singleton configured with a request interceptor that injects `Authorization: Bearer <JWT>` into headers.
2. **Gateway / Security Filter Chain (Spring Security)**: Incoming HTTP requests hit `AuthTokenFilter` (an extension of `OncePerRequestFilter`). It extracts the token, verifies the HMAC-SHA256 signature using `JwtUtils`, parses the claims, loads the user's `UserDetails` via `UserDetailsServiceImpl`, and populates the `SecurityContextHolder`.
3. **Controller Layer (`@RestController`)**: Requests are routed by `DispatcherServlet` to specific endpoints (e.g., `StoryController`). Jakarta validation (`@Valid`) inspects incoming DTOs. If validation fails, `GlobalExceptionHandler` intercepts and formats a standardized 400 response.
4. **Service Layer (`@Service`)**: Encapsulates business logic, transaction boundaries (`@Transactional`), and entity state transformations (e.g., calculating priority scores or transitioning sprint states).
5. **Data Access Layer (`@Repository`)**: Spring Data JPA interfaces backed by Hibernate translate object manipulations into optimized SQL queries.
6. **Persistence Layer (PostgreSQL 16 / H2)**: Queries are executed against relational tables utilizing foreign key constraints, unique indexes, and HikariCP connection pooling.

---

### 2. How does Spring Boot handle incoming HTTP requests?
**Answer:**
Spring Boot leverages the Front Controller pattern centered around `DispatcherServlet`:
1. The embedded Tomcat container receives the TCP socket request on port 8080 and passes it through the registered `Filter` chain (including Spring Security's `FilterChainProxy`).
2. Once through security filters, the request enters `DispatcherServlet.doDispatch()`.
3. `DispatcherServlet` consults `HandlerMapping` (e.g., `RequestMappingHandlerMapping`) to identify the matching controller method based on URL path, HTTP verb, headers, and media types.
4. It calls `HandlerAdapter` (e.g., `RequestMappingHandlerAdapter`), which resolves method arguments (`@PathVariable`, `@RequestBody`, `@AuthenticationPrincipal`) using configured `HttpMessageConverter` instances (like Jackson for JSON).
5. The controller executes, returning a DTO or `ResponseEntity`. Jackson serializes the return object into JSON, and the HTTP response with appropriate status code is streamed back to the client.

---

### 3. How is JWT authentication implemented in SprintPilot?
**Answer:**
Authentication in SprintPilot is completely stateless:
1. **Issuance**: When the user posts credentials to `/api/auth/login`, `AuthenticationManager.authenticate()` validates the plaintext password against the BCrypt hash in PostgreSQL. Upon success, `JwtUtils.generateJwtToken()` signs a JWT containing the user's email subject, issued-at, expiration (24 hours), and assigned role authorities using `Keys.hmacShaKeyFor(secretBytes)`.
2. **Storage**: The React frontend receives the token and stores it in `localStorage`.
3. **Transmission**: The Axios request interceptor injects the header `Authorization: Bearer <token>` on all outbound calls.
4. **Validation**: On each request, `AuthTokenFilter` parses the header, verifies the signature against the server's secret, checks that `exp` > current time, and sets `SecurityContextHolder.getContext().setAuthentication(authToken)`.
5. **Stateless Benefit**: The backend maintains zero session state in RAM, allowing horizontal scaling across multiple container replicas without needing sticky sessions or distributed session caches like Redis.

---

### 4. How do you prevent unauthorized role escalation in the backend?
**Answer:**
Role escalation is prevented at three distinct layers:
1. **Declarative Method Security (`@PreAuthorize`)**: Enabled via `@EnableMethodSecurity(prePostEnabled = true)`. Sensitive endpoints specify strict role requirements, such as `@PreAuthorize("hasRole('ADMIN') or hasRole('PRODUCT_MANAGER')")` on product and sprint creation endpoints.
2. **DTO Sanitization on User Creation**: The `RegisterRequest` DTO intentionally does not expose an arbitrary role override for public registration. Self-registered users are assigned `ROLE_VIEWER` or `ROLE_DEVELOPER` by default; only authenticated administrators can invoke user-role mutation endpoints.
3. **Cryptographic Token Integrity**: The JWT signature prevents client-side tampering of the `roles` claim. If an attacker alters the role payload in their token from `ROLE_VIEWER` to `ROLE_ADMIN`, signature verification immediately fails with `SignatureException`, and the request is rejected with a 401 Unauthorized.

---

### 5. Explain the data model relationships between Product, Requirement, UserStory, Sprint, and Task.
**Answer:**
The domain reflects standard agile product management hierarchy:
- **`Product` 1-to-Many `Requirement`**: A product has many high-level business initiatives/PRD specs.
- **`Requirement` 1-to-Many `UserStory`**: A business requirement is decomposed into discrete functional agile stories.
- **`Product` 1-to-Many `Sprint`**: Sprints belong to a specific product container.
- **`Sprint` 1-to-Many `UserStory`** (Nullable Foreign Key): A user story belongs to a product backlog initially (`sprint_id = null`). When planned into an iteration, `sprint_id` is assigned. When a sprint completes, any unfinished stories are unlinked back to the product backlog.
- **`UserStory` 1-to-Many `Task`**: Engineering user stories are broken down into technical sub-tasks (e.g., "Write database migration", "Implement React component").
- **`UserStory` 1-to-1 `Blocker`**: A story can have an active blocker record recording impediment details and resolution cycle time.

---

### 6. How does Hibernate / Spring Data JPA handle lazy vs eager loading in SprintPilot?
**Answer:**
- **Default Fetch Types**: In JPA, `@ManyToOne` and `@OneToOne` default to `FetchType.EAGER`, whereas `@OneToMany` and `@ManyToMany` default to `FetchType.LAZY`.
- **SprintPilot Configuration**: All collection associations (`UserStory.tasks`, `UserStory.comments`, `Product.requirements`) explicitly declare `fetch = FetchType.LAZY`. This prevents fetching entire hierarchies of comments and sub-tasks when merely querying a list of stories for the backlog view.
- **Serialization Handling**: To prevent `LazyInitializationException` during Jackson serialization outside transaction contexts, controllers return explicit DTOs (`StoryResponse`, `SprintSummaryDto`) mapped within the transactional service layer, rather than exposing raw JPA entity proxies directly to the web tier.

---

### 7. What is the N+1 query problem, and where could it occur in this project? How did you prevent/solve it?
**Answer:**
- **The Problem**: If you fetch $N$ `UserStory` records, and then in a loop access `story.getAssignee().getFullName()`, Hibernate may execute 1 initial query for the stories, plus $N$ subsequent individual `SELECT * FROM users WHERE id = ?` queries—leading to severe latency under load.
- **Prevention in SprintPilot**:
  1. We use **JPQL `JOIN FETCH` queries** in `UserStoryRepository` when retrieving Kanban board cards:
     ```java
     @Query("SELECT s FROM UserStory s LEFT JOIN FETCH s.assignee LEFT JOIN FETCH s.blocker WHERE s.sprint.id = :sprintId")
     List<UserStory> findBySprintIdWithDetails(@Param("sprintId") UUID sprintId);
     ```
  2. For entity graphs, we specify `@EntityGraph(attributePaths = {"assignee", "blocker"})` on repository methods to fetch all necessary relational metadata in a single SQL inner/left join.

---

### 8. Explain the mathematical formula used for story prioritization. Why is it designed this way?
**Answer:**
The formula is:
$$\text{Priority Score} = (\text{Business Value} \times 1.5) + (\text{Customer Impact} \times 1.2) + (\text{Urgency} \times 1.0) - (\text{Technical Complexity} \times 0.8)$$

- **Weighting Rationale**:
  - **Business Value (1.5x)** carries the highest weight because engineering bandwidth must directly move business KPIs and organizational revenue.
  - **Customer Impact (1.2x)** ensures that user satisfaction, usability, and customer retention are heavily valued.
  - **Urgency (1.0x)** accounts for critical contractual obligations, security vulnerabilities, or release timelines.
  - **Technical Complexity (-0.8x penalty)** acts as a denominator proxy (similar to WSJF - Weighted Shortest Job First). High complexity reduces the immediate return on investment; prioritizing high-value, lower-complexity stories delivers quick iterative wins.
- **Normalization**: All input variables are bounded between 1 and 10, producing predictable, objective numeric scores that automatically order the product backlog.

---

### 9. How is the Kanban board state managed in React, and how does it sync with the backend?
**Answer:**
1. **Local State & Columns**: The board groups stories into four state arrays (`BACKLOG`, `IN_PROGRESS`, `IN_REVIEW`, `DONE`).
2. **Optimistic Updates**: When an engineer moves a story from `IN_PROGRESS` to `IN_REVIEW`, React updates the local state immediately, giving zero-latency visual feedback.
3. **Backend Synchronization**: An asynchronous PUT request is dispatched to `/api/stories/{id}/status` with `{ status: "IN_REVIEW" }`.
4. **Error Rollback**: If the network request fails or the backend responds with a 403/500 error, a `catch` handler reverts the story card to its original column and triggers a red toast alert informing the user of the sync failure.

---

### 10. How does SprintPilot calculate team velocity and completion metrics?
**Answer:**
All analytics originate directly from relational aggregations in `AnalyticsService`:
- **Average Team Velocity**:
  ```sql
  SELECT COALESCE(AVG(s.completedPoints), 0) FROM Sprint s WHERE s.product.id = :productId AND s.status = 'COMPLETED'
  ```
- **Sprint Completion Percentage**:
  $$\text{Completion Rate} = \left( \frac{\sum \text{Story Points of Stories with Status 'DONE'}}{\text{Total Committed Story Points in Sprint}} \right) \times 100$$
- **Workload per Developer**:
  Calculated using `GROUP BY s.assignee.fullName`, aggregating total active points to detect bottlenecks before sprint burnout occurs.
- **Authenticity**: There are no hardcoded mocks or randomized numbers; if no sprints are completed, velocity accurately reflects 0.

---

### 11. What happens if the AI service fails or runs out of credits? (Explain the offline heuristic fallback).
**Answer:**
SprintPilot was designed with enterprise resiliency in mind:
1. `AiAssistantService.generateUserStory(prompt)` first checks if `OPENAI_API_KEY` is present and valid.
2. If an API key is configured, it sends a structured JSON schema prompt to `https://api.openai.com/v1/chat/completions`.
3. If the key is missing, network connectivity is severed, or OpenAI returns a 429/500 error, the service catches the exception and immediately invokes `generateHeuristicFallback(prompt)`.
4. The heuristic engine applies regular expressions and NLP pattern matching:
   - Scans for user roles (`as a [user/admin/manager]`).
   - Identifies intended actions (`want to [verb phrase]`).
   - Extracts business benefits (`so that [benefit phrase]`).
   - Synthesizes formatted Gherkin acceptance criteria (`Given`, `When`, `Then`).
   - Estimates Fibonacci points based on prompt keyword complexity.
5. **Result**: The feature works 100% of the time during technical demos and grading evaluations without dependency on paid external APIs.

---

### 12. How did you structure your global exception handling and API response format?
**Answer:**
We implemented `@RestControllerAdvice` in `GlobalExceptionHandler`:
1. **Custom Exceptions**: Classes like `ResourceNotFoundException`, `BadRequestException`, and `AccessDeniedException` convey semantic HTTP statuses.
2. **Unified Error Envelope**: All errors return a consistent JSON payload:
   ```json
   {
     "status": 404,
     "error": "Not Found",
     "message": "UserStory with ID '...' not found",
     "timestamp": "2026-09-17T02:00:00Z",
     "path": "/api/stories/123"
   }
   ```
3. **Bean Validation Handling**: Catches `MethodArgumentNotValidException`, extracts field errors from `BindingResult`, and returns a dictionary mapping field names to human-readable error messages (e.g. `{"title": "Title must be between 3 and 120 characters"}`).

---

### 13. Explain the CORS policy configured in Spring Boot and why it's necessary.
**Answer:**
- **Why CORS is Needed**: Modern browsers enforce the Same-Origin Policy (SOP). Because the React dev server runs on `http://localhost:5173` and the Spring Boot backend runs on `http://localhost:8080`, browser `fetch`/`XMLHttpRequest` preflight requests (`OPTIONS`) would be blocked without explicit Cross-Origin Resource Sharing headers.
- **Configuration**: Implemented in `WebSecurityConfig` and `WebMvcConfigurer`:
  ```java
  @Bean
  public CorsConfigurationSource corsConfigurationSource() {
      CorsConfiguration config = new CorsConfiguration();
      config.setAllowedOrigins(Arrays.asList(allowedOrigins.split(",")));
      config.setAllowedMethods(List.of("GET", "POST", "PUT", "DELETE", "OPTIONS", "PATCH"));
      config.setAllowedHeaders(List.of("Authorization", "Content-Type", "Accept"));
      config.setAllowCredentials(true);
      UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
      source.registerCorsConfiguration("/**", config);
      return source;
  }
  ```
  Origins are configurable via environment variables (`APP_CORS_ALLOWED_ORIGINS`).

---

### 14. How does Spring Security's filter chain work in SprintPilot?
**Answer:**
Spring Security routes incoming requests through `SecurityFilterChain`:
1. `CorsFilter` and `CsrfFilter`: Validates origins and disables CSRF (since stateless JWTs in Authorization headers are immune to cross-site request forgery attacks that target ambient cookie credentials).
2. `AuthEntryPointJwt`: Custom entry point implementing `AuthenticationEntryPoint` that intercepts unauthenticated requests and returns standard HTTP 401 JSON instead of redirecting to an HTML login form.
3. `AuthTokenFilter`: Added before `UsernamePasswordAuthenticationFilter` via `.addFilterBefore(authTokenFilter(), UsernamePasswordAuthenticationFilter.class)`. It processes the Bearer token and creates a `UsernamePasswordAuthenticationToken`.
4. `AuthorizationFilter`: Evaluates URL pattern matchers (`/api/auth/**` permitted; `/api/**` authenticated).

---

### 15. What are the advantages of using Vite over Create-React-App for this project?
**Answer:**
1. **ESM-Based Dev Server**: CRA uses Webpack, which bundles the entire application before starting the dev server. Vite uses native browser ES Modules (ESM) and compiles files on-demand via `esbuild` (written in Go), starting the local dev server in <300ms compared to CRA's 30+ seconds.
2. **Instant Hot Module Replacement (HMR)**: When editing a Tailwind class or React component, Vite swaps only the modified module without losing React component state.
3. **Optimized Rollup Production Builds**: Vite uses Rollup for tree-shaking and multi-chunk code splitting, generating lean production artifacts.
4. **Maintenance**: Create-React-App is officially deprecated by the React team; Vite is the modern standard recommended in the React ecosystem.

---

### 16. How does Docker containerization work for this full-stack application?
**Answer:**
SprintPilot uses **multi-stage Docker builds** managed by `docker-compose.yml`:
1. **Backend Stage**:
   - *Stage 1 (Build)*: Uses `eclipse-temurin:17-jdk-jammy`. Copies `pom.xml` and wrapper first to cache Maven dependency downloads; then compiles and packages the JAR with `./mvnw package -DskipTests`.
   - *Stage 2 (Runtime)*: Uses `eclipse-temurin:17-jre-jammy`. Runs as a dedicated non-root user (`sprintpilot`) with memory limits (`-Xms256m -Xmx512m`), reducing final image size from ~900MB to ~240MB.
2. **Frontend Stage**:
   - *Stage 1 (Build)*: Uses `node:20-alpine`, runs `npm ci` and `npm run build` to generate static assets in `/dist`.
   - *Stage 2 (Runtime)*: Uses lightweight `nginx:alpine` to serve static assets with gzip compression and forward `/api/` traffic to the backend container.
3. **Database**: PostgreSQL 16 Alpine container with persistent named volume and automated `pg_isready` healthcheck before backend boot.

---

### 17. Explain your database migration strategy in development vs production.
**Answer:**
- **Development Profile (`dev`)**: `spring.jpa.hibernate.ddl-auto=update` coupled with an in-memory H2 database. `DataSeeder.java` listens to `ApplicationReadyEvent` and automatically checks if users exist; if not, it populates realistic products, sprints, stories, and personas.
- **Production Profile (`prod`)**: In enterprise production, `ddl-auto` is set to `validate` or `none`. Database schema evolutions are managed via version-controlled migration scripts using **Flyway** or **Liquibase**. This ensures that every schema modification (DDL) is committed to Git, tested in staging, and applied idempotently with backward compatibility during zero-downtime rolling updates.

---

### 18. How do you handle transaction management (`@Transactional`) in complex business workflows?
**Answer:**
Consider the **Complete Sprint** operation in `SprintService`:
```java
@Transactional
public SprintResponse completeSprint(UUID sprintId) {
    Sprint sprint = sprintRepository.findById(sprintId)
        .orElseThrow(() -> new ResourceNotFoundException("Sprint", sprintId));
    
    // 1. Mark sprint COMPLETED
    sprint.setStatus(SprintStatus.COMPLETED);
    sprint.setCompletedAt(LocalDateTime.now());

    // 2. Query all unfinished stories
    List<UserStory> unfinishedStories = storyRepository
        .findBySprintIdAndStatusNot(sprintId, StoryStatus.DONE);
    
    // 3. Move them back to product backlog
    for (UserStory story : unfinishedStories) {
        story.setSprint(null);
    }
    storyRepository.saveAll(unfinishedStories);

    // 4. Recalculate completed story points
    int completedPoints = storyRepository.sumPointsBySprintIdAndStatus(sprintId, StoryStatus.DONE);
    sprint.setCompletedPoints(completedPoints);

    return mapToResponse(sprintRepository.save(sprint));
}
```
If an exception occurs anywhere during this process (e.g., database constraint violation or network timeout), `@Transactional` ensures that Hibernate triggers a `ROLLBACK`. The database is never left in a corrupt state where the sprint is marked completed while unfinished stories remain stuck.

---

### 19. How does React Context manage global state without redundant re-renders?
**Answer:**
SprintPilot separates global state into three domain-specific Contexts:
1. **`AuthContext`**: Tracks authentication token, user persona, and role privileges.
2. **`ProductContext`**: Tracks the currently selected product across the sidebar and pages.
3. **`ToastContext`**: Manages transient floating notifications.

**Optimization**:
- By splitting concerns instead of putting everything into a single monolithic context, a change in active toast messages does not re-render the Kanban board or navigation sidebar.
- State setters (`setProducts`, `setCurrentProduct`) are memoized via `useCallback`, ensuring downstream components consuming the context only re-render when their specific dependent slice of data changes.

---

### 20. If SprintPilot had to scale to 100,000 active daily users, what architectural changes would you make?
**Answer:**
1. **Database Read Replicas & Connection Pooling**: Implement a PostgreSQL Primary (writes) with multiple read replicas for read-heavy operations (e.g., analytics dashboards and backlog viewing) using Spring's `AbstractRoutingDataSource`.
2. **Redis Caching Layer**: Cache frequently read, rarely changed entities (such as product details and user roles) using Spring Cache (`@Cacheable(value = "products", key = "#id")`).
3. **Real-Time Kanban Sync with WebSockets (STOMP / SockJS)**: Replace polling with WebSocket push notifications so that when one developer moves a card on the Kanban board, all team members see the transition immediately.
4. **Asynchronous Background Processing**: Offload AI story generation and analytics rollups to asynchronous worker threads using **RabbitMQ** or **Apache Kafka** with Spring `@Async` workers.
5. **Horizontal Container Auto-scaling**: Deploy containerized backend replicas on AWS ECS Fargate or Google Cloud Run behind an Application Load Balancer (ALB).
