package com.sprintpilot.api.config;

import com.sprintpilot.api.entity.*;
import com.sprintpilot.api.repository.*;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

import java.time.LocalDate;
import java.util.Arrays;
import java.util.HashSet;
import java.util.List;

@Component
public class DataSeeder implements CommandLineRunner {

    private static final Logger logger = LoggerFactory.getLogger(DataSeeder.class);

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private ProductRepository productRepository;

    @Autowired
    private RequirementRepository requirementRepository;

    @Autowired
    private SprintRepository sprintRepository;

    @Autowired
    private ReleaseRepository releaseRepository;

    @Autowired
    private UserStoryRepository userStoryRepository;

    @Autowired
    private TaskRepository taskRepository;

    @Autowired
    private CommentRepository commentRepository;

    @Autowired
    private BlockerRepository blockerRepository;

    @Autowired
    private TeamRepository teamRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Override
    public void run(String... args) {
        if (userRepository.count() > 0) {
            logger.info("DataSeeder: Database already populated, skipping seed.");
            return;
        }

        logger.info("DataSeeder: Seeding demo accounts and realistic SaaS dataset...");

        String password = passwordEncoder.encode("DemoPassword123!");

        // 1. Users
        User admin = new User("Alex Vance", "admin@sprintpilot.demo", password, Role.ROLE_ADMIN, "Engineering VP", "Executive");
        User pm = new User("Sarah Jenkins", "product@sprintpilot.demo", password, Role.ROLE_PRODUCT_MANAGER, "Lead Product Manager", "Product Management");
        User dev = new User("Marcus Chen", "developer@sprintpilot.demo", password, Role.ROLE_DEVELOPER, "Senior Full-Stack Engineer", "Engineering");
        User viewer = new User("Elena Rostova", "viewer@sprintpilot.demo", password, Role.ROLE_VIEWER, "Product Stakeholder", "Business Operations");

        userRepository.saveAll(Arrays.asList(admin, pm, dev, viewer));

        // 2. Products
        Product coreProduct = new Product(
                "SprintPilot Core Platform",
                "sprintpilot-core",
                "AI-assisted product and engineering orchestration SaaS for agile sprint cycles and objective backlog prioritization.",
                ProductStatus.ACTIVE,
                pm,
                LocalDate.now().plusMonths(3)
        );

        Product fintechGateway = new Product(
                "NxtPe Payments Router",
                "nxtpe-payments-router",
                "Ultra-low latency UPI and credit switch with automated merchant settlement and idempotent ledgering.",
                ProductStatus.IN_DISCOVERY,
                pm,
                LocalDate.now().plusMonths(6)
        );

        productRepository.saveAll(Arrays.asList(coreProduct, fintechGateway));

        // 3. Teams
        Team alphaTeam = new Team("Alpha Platform Squad", "Engineering", dev);
        alphaTeam.setMembers(new HashSet<>(Arrays.asList(dev, admin)));
        teamRepository.save(alphaTeam);

        // 4. Requirements (PRD)
        Requirement req1 = new Requirement(
                coreProduct,
                "Role-Based Access Control & JWT Session Management",
                "Enforce strict role permissions across Admin, PM, Developer, and Viewer personas with stateless JWT bearer tokens.",
                9,
                Priority.CRITICAL,
                RequirementStatus.APPROVED,
                "Security Operations",
                "v1.0.0"
        );

        Requirement req2 = new Requirement(
                coreProduct,
                "Objective Backlog Prioritization Model",
                "Provide an explainable priority scoring formula: (BV*1.5 + CI*1.2 + U*1.0 - C*0.8) to eliminate subjective roadmap disputes.",
                8,
                Priority.HIGH,
                RequirementStatus.APPROVED,
                "Product Council",
                "v1.0.0"
        );

        Requirement req3 = new Requirement(
                coreProduct,
                "AI-Assisted User Story Generation Engine",
                "Convert natural language product requirements into structured agile user stories with Gherkin acceptance criteria.",
                9,
                Priority.HIGH,
                RequirementStatus.APPROVED,
                "Product Leadership",
                "v1.1.0"
        );

        requirementRepository.saveAll(Arrays.asList(req1, req2, req3));

        // 5. Releases
        Release rel1 = new Release(coreProduct, "v1.0.0", "General Availability MVP", "First public release featuring authentication, backlog prioritization, and active sprint boards.", LocalDate.now().plusWeeks(4), ReleaseStatus.ACTIVE);
        Release rel2 = new Release(coreProduct, "v1.1.0", "AI Expansion Milestone", "Adding generative user story assistant and deep engineering analytics.", LocalDate.now().plusMonths(2), ReleaseStatus.PLANNED);
        releaseRepository.saveAll(Arrays.asList(rel1, rel2));

        // 6. Sprints
        Sprint s1 = new Sprint(coreProduct, "Sprint 1: Foundation & Auth", "Bootstrap Spring Boot security architecture and data persistence layer.", LocalDate.now().minusWeeks(4), LocalDate.now().minusWeeks(2), SprintStatus.COMPLETED);
        s1.setTotalPoints(22);
        s1.setCompletedPoints(22);

        Sprint s2 = new Sprint(coreProduct, "Sprint 2: Backlog & Kanban", "Implement objective priority scoring and interactive Kanban board with drag and drop status tracking.", LocalDate.now().minusDays(5), LocalDate.now().plusDays(9), SprintStatus.ACTIVE);
        s2.setTotalPoints(18);
        s2.setCompletedPoints(8);

        Sprint s3 = new Sprint(coreProduct, "Sprint 3: AI Assistant & Polish", "Build AI assistant prompt handler and deploy containerized production release.", LocalDate.now().plusDays(10), LocalDate.now().plusDays(24), SprintStatus.PLANNING);
        s3.setTotalPoints(21);
        s3.setCompletedPoints(0);

        sprintRepository.saveAll(Arrays.asList(s1, s2, s3));

        // 7. User Stories
        UserStory story1 = new UserStory();
        story1.setProduct(coreProduct);
        story1.setRequirement(req1);
        story1.setSprint(s2);
        story1.setRelease(rel1);
        story1.setTitle("Implement stateless JWT token authentication filter");
        story1.setAsA("Developer");
        story1.setIWant("to authenticate API requests via Authorization: Bearer <jwt> headers");
        story1.setSoThat("the backend can verify user identity and role authorizations without server-side session affinity");
        story1.setAcceptanceCriteria("1. Given valid credentials to /api/auth/login, then receive 200 OK with signed JWT.\n2. Given an expired or forged token, then receive 401 Unauthorized.\n3. Given valid Bearer token, Spring Security context is populated with user principal and authorities.");
        story1.setPriority(Priority.CRITICAL);
        story1.setStoryPoints(5);
        story1.setStatus(StoryStatus.DONE);
        story1.setAssignee(dev);
        story1.setReporter(pm);
        story1.setBusinessValue(9);
        story1.setCustomerImpact(8);
        story1.setUrgency(9);
        story1.setComplexity(4);
        story1.setLabels("security,auth,backend");
        story1.setDueDate(LocalDate.now().plusDays(2));
        story1.calculatePriorityScore();

        UserStory story2 = new UserStory();
        story2.setProduct(coreProduct);
        story2.setRequirement(req2);
        story2.setSprint(s2);
        story2.setRelease(rel1);
        story2.setTitle("Backlog prioritization algorithm and sorting interface");
        story2.setAsA("Product Manager");
        story2.setIWant("to evaluate backlog items based on Business Value, Impact, Urgency, and Complexity");
        story2.setSoThat("the team can objectively rank high-ROI features during sprint planning");
        story2.setAcceptanceCriteria("1. Provide dynamic sliders for all 4 prioritization metrics.\n2. Compute score instantly in real-time.\n3. Sort backlog by Priority Score in descending order.");
        story2.setPriority(Priority.HIGH);
        story2.setStoryPoints(3);
        story2.setStatus(StoryStatus.DONE);
        story2.setAssignee(dev);
        story2.setReporter(pm);
        story2.setBusinessValue(8);
        story2.setCustomerImpact(8);
        story2.setUrgency(7);
        story2.setComplexity(3);
        story2.setLabels("product,backlog,algorithm");
        story2.setDueDate(LocalDate.now().plusDays(4));
        story2.calculatePriorityScore();

        UserStory story3 = new UserStory();
        story3.setProduct(coreProduct);
        story3.setRequirement(req1);
        story3.setSprint(s2);
        story3.setRelease(rel1);
        story3.setTitle("Interactive Kanban board with persisted status updates");
        story3.setAsA("Developer");
        story3.setIWant("to transition stories across TODO, IN_PROGRESS, IN_REVIEW, and DONE columns");
        story3.setSoThat("the entire squad has live visibility into active sprint throughput");
        story3.setAcceptanceCriteria("1. Display stories categorized by column.\n2. Allow one-click status transitions.\n3. Persist status via PUT /api/stories/{id}/status and reflect updated sprint points.");
        story3.setPriority(Priority.HIGH);
        story3.setStoryPoints(5);
        story3.setStatus(StoryStatus.IN_PROGRESS);
        story3.setAssignee(dev);
        story3.setReporter(pm);
        story3.setBusinessValue(8);
        story3.setCustomerImpact(7);
        story3.setUrgency(8);
        story3.setComplexity(5);
        story3.setLabels("frontend,kanban,react");
        story3.setDueDate(LocalDate.now().plusDays(5));
        story3.calculatePriorityScore();

        UserStory story4 = new UserStory();
        story4.setProduct(coreProduct);
        story4.setRequirement(req3);
        story4.setSprint(s2);
        story4.setRelease(rel1);
        story4.setTitle("AI user story generator with offline NLP heuristic fallback");
        story4.setAsA("Product Manager");
        story4.setIWant("to input natural language feature prompts and receive structured acceptance criteria");
        story4.setSoThat("I can draft high-quality user stories in seconds without manual boilerplate");
        story4.setAcceptanceCriteria("1. Provide prompt textarea with sample suggestions.\n2. Generate persona, user story, acceptance criteria, and points.\n3. Include one-click 'Save to Backlog' action.\n4. Ensure fallback works without external API key.");
        story4.setPriority(Priority.HIGH);
        story4.setStoryPoints(5);
        story4.setStatus(StoryStatus.BLOCKED);
        story4.setAssignee(dev);
        story4.setReporter(pm);
        story4.setBusinessValue(9);
        story4.setCustomerImpact(9);
        story4.setUrgency(8);
        story4.setComplexity(6);
        story4.setLabels("ai,productivity,fast-track");
        story4.setDueDate(LocalDate.now().plusDays(6));
        story4.calculatePriorityScore();

        UserStory story5 = new UserStory();
        story5.setProduct(coreProduct);
        story5.setRequirement(req2);
        story5.setSprint(null); // Backlog item
        story5.setRelease(rel2);
        story5.setTitle("Export sprint retrospectives and velocity charts to PDF");
        story5.setAsA("Product Manager");
        story5.setIWant("to generate downloadable PDF reports of sprint delivery and team velocity");
        story5.setSoThat("I can present clean sprint analytics during monthly executive reviews");
        story5.setAcceptanceCriteria("1. Include velocity graph, completed vs planned points.\n2. Summarize key blockers and cycle times.\n3. Clean, branded print layout.");
        story5.setPriority(Priority.MEDIUM);
        story5.setStoryPoints(5);
        story5.setStatus(StoryStatus.BACKLOG);
        story5.setAssignee(null);
        story5.setReporter(pm);
        story5.setBusinessValue(6);
        story5.setCustomerImpact(6);
        story5.setUrgency(5);
        story5.setComplexity(4);
        story5.setLabels("reporting,export,analytics");
        story5.calculatePriorityScore();

        UserStory story6 = new UserStory();
        story6.setProduct(coreProduct);
        story6.setRequirement(req1);
        story6.setSprint(null); // Backlog item
        story6.setRelease(rel2);
        story6.setTitle("Audit logging for sensitive product configuration changes");
        story6.setAsA("Security Auditor");
        story6.setIWant("to inspect an immutable log of user role updates and product archival actions");
        story6.setSoThat("our compliance requirements for SOC2 can be fully demonstrated");
        story6.setAcceptanceCriteria("1. Record timestamp, actor ID, target entity, and change delta.\n2. Read-only view accessible only by ROLE_ADMIN.");
        story6.setPriority(Priority.LOW);
        story6.setStoryPoints(3);
        story6.setStatus(StoryStatus.BACKLOG);
        story6.setAssignee(null);
        story6.setReporter(admin);
        story6.setBusinessValue(5);
        story6.setCustomerImpact(4);
        story6.setUrgency(4);
        story6.setComplexity(3);
        story6.setLabels("security,compliance,audit");
        story6.calculatePriorityScore();

        userStoryRepository.saveAll(Arrays.asList(story1, story2, story3, story4, story5, story6));

        // 8. Tasks
        Task t1 = new Task();
        t1.setUserStory(story3);
        t1.setTitle("Design React column components and badge indicators");
        t1.setStatus(TaskStatus.DONE);
        t1.setAssignee(dev);
        t1.setEstimatedHours(3.0);
        t1.setLoggedHours(3.0);

        Task t2 = new Task();
        t2.setUserStory(story3);
        t2.setTitle("Wire status mutation API endpoints to React Query/state");
        t2.setStatus(TaskStatus.IN_PROGRESS);
        t2.setAssignee(dev);
        t2.setEstimatedHours(4.0);
        t2.setLoggedHours(2.5);

        taskRepository.saveAll(Arrays.asList(t1, t2));

        // 9. Comments & Blockers
        Comment c1 = new Comment(story4, pm, "We tested the prompt parsing logic with 12 distinct requirement scenarios. Heuristic accuracy is great.");
        Comment c2 = new Comment(story4, dev, "Adding automated fallback tests to verify response structure when offline.");
        commentRepository.saveAll(Arrays.asList(c1, c2));

        Blocker b1 = new Blocker(story4, "Awaiting staging environment rate-limit confirmation from cloud provider.", dev);
        blockerRepository.save(b1);

        logger.info("DataSeeder: Database successfully seeded with 4 users, 2 products, 3 sprints, 6 stories, tasks, blockers, and comments!");
    }
}
