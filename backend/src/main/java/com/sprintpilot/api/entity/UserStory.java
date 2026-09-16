package com.sprintpilot.api.entity;

import jakarta.persistence.*;
import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import java.time.LocalDate;
import java.time.LocalDateTime;

@Entity
@Table(name = "user_stories")
public class UserStory {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotNull
    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "product_id", nullable = false)
    private Product product;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "requirement_id")
    private Requirement requirement;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "sprint_id")
    private Sprint sprint;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "release_id")
    private Release release;

    @NotBlank
    @Column(nullable = false)
    private String title;

    private String asA;
    private String iWant;
    private String soThat;

    @Column(length = 4000)
    private String acceptanceCriteria;

    @NotNull
    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private Priority priority = Priority.MEDIUM;

    private Integer storyPoints = 3;

    @NotNull
    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private StoryStatus status = StoryStatus.BACKLOG;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "assignee_id")
    private User assignee;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "reporter_id")
    private User reporter;

    // Prioritization model attributes (1 - 10)
    @Min(1) @Max(10)
    private Integer businessValue = 5;

    @Min(1) @Max(10)
    private Integer customerImpact = 5;

    @Min(1) @Max(10)
    private Integer urgency = 5;

    @Min(1) @Max(10)
    private Integer complexity = 5;

    // Priority Score = (BusinessValue * 1.5) + (CustomerImpact * 1.2) + (Urgency * 1.0) - (Complexity * 0.8)
    private Double priorityScore = 0.0;

    private String labels; // comma-separated labels
    private LocalDate dueDate;

    @Column(nullable = false, updatable = false)
    private LocalDateTime createdAt;

    private LocalDateTime updatedAt;

    @PrePersist
    protected void onCreate() {
        this.createdAt = LocalDateTime.now();
        this.updatedAt = LocalDateTime.now();
        calculatePriorityScore();
    }

    @PreUpdate
    protected void onUpdate() {
        this.updatedAt = LocalDateTime.now();
        calculatePriorityScore();
    }

    public void calculatePriorityScore() {
        int bv = businessValue != null ? businessValue : 5;
        int ci = customerImpact != null ? customerImpact : 5;
        int u = urgency != null ? urgency : 5;
        int comp = complexity != null ? complexity : 5;
        this.priorityScore = Math.round(((bv * 1.5) + (ci * 1.2) + (u * 1.0) - (comp * 0.8)) * 10.0) / 10.0;
    }

    public UserStory() {}

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public Product getProduct() { return product; }
    public void setProduct(Product product) { this.product = product; }

    public Requirement getRequirement() { return requirement; }
    public void setRequirement(Requirement requirement) { this.requirement = requirement; }

    public Sprint getSprint() { return sprint; }
    public void setSprint(Sprint sprint) { this.sprint = sprint; }

    public Release getRelease() { return release; }
    public void setRelease(Release release) { this.release = release; }

    public String getTitle() { return title; }
    public void setTitle(String title) { this.title = title; }

    public String getAsA() { return asA; }
    public void setAsA(String asA) { this.asA = asA; }

    public String getIWant() { return iWant; }
    public void setIWant(String iWant) { this.iWant = iWant; }

    public String getSoThat() { return soThat; }
    public void setSoThat(String soThat) { this.soThat = soThat; }

    public String getAcceptanceCriteria() { return acceptanceCriteria; }
    public void setAcceptanceCriteria(String acceptanceCriteria) { this.acceptanceCriteria = acceptanceCriteria; }

    public Priority getPriority() { return priority; }
    public void setPriority(Priority priority) { this.priority = priority; }

    public Integer getStoryPoints() { return storyPoints; }
    public void setStoryPoints(Integer storyPoints) { this.storyPoints = storyPoints; }

    public StoryStatus getStatus() { return status; }
    public void setStatus(StoryStatus status) { this.status = status; }

    public User getAssignee() { return assignee; }
    public void setAssignee(User assignee) { this.assignee = assignee; }

    public User getReporter() { return reporter; }
    public void setReporter(User reporter) { this.reporter = reporter; }

    public Integer getBusinessValue() { return businessValue; }
    public void setBusinessValue(Integer businessValue) {
        this.businessValue = businessValue;
        calculatePriorityScore();
    }

    public Integer getCustomerImpact() { return customerImpact; }
    public void setCustomerImpact(Integer customerImpact) {
        this.customerImpact = customerImpact;
        calculatePriorityScore();
    }

    public Integer getUrgency() { return urgency; }
    public void setUrgency(Integer urgency) {
        this.urgency = urgency;
        calculatePriorityScore();
    }

    public Integer getComplexity() { return complexity; }
    public void setComplexity(Integer complexity) {
        this.complexity = complexity;
        calculatePriorityScore();
    }

    public Double getPriorityScore() { return priorityScore; }
    public void setPriorityScore(Double priorityScore) { this.priorityScore = priorityScore; }

    public String getLabels() { return labels; }
    public void setLabels(String labels) { this.labels = labels; }

    public LocalDate getDueDate() { return dueDate; }
    public void setDueDate(LocalDate dueDate) { this.dueDate = dueDate; }

    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }

    public LocalDateTime getUpdatedAt() { return updatedAt; }
    public void setUpdatedAt(LocalDateTime updatedAt) { this.updatedAt = updatedAt; }
}
