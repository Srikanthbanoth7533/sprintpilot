package com.sprintpilot.api.dto;

import com.sprintpilot.api.entity.Priority;
import com.sprintpilot.api.entity.StoryStatus;
import com.sprintpilot.api.entity.UserStory;
import java.time.LocalDate;
import java.time.LocalDateTime;

public class StoryResponse {
    private Long id;
    private Long productId;
    private String productTitle;
    private Long requirementId;
    private String requirementTitle;
    private Long sprintId;
    private String sprintName;
    private Long releaseId;
    private String releaseName;
    private String title;
    private String asA;
    private String iWant;
    private String soThat;
    private String acceptanceCriteria;
    private Priority priority;
    private Integer storyPoints;
    private StoryStatus status;
    private UserDto assignee;
    private UserDto reporter;
    private Integer businessValue;
    private Integer customerImpact;
    private Integer urgency;
    private Integer complexity;
    private Double priorityScore;
    private String labels;
    private LocalDate dueDate;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;

    public StoryResponse() {}

    public static StoryResponse fromEntity(UserStory story) {
        if (story == null) return null;
        StoryResponse res = new StoryResponse();
        res.setId(story.getId());
        res.setProductId(story.getProduct().getId());
        res.setProductTitle(story.getProduct().getName());
        if (story.getRequirement() != null) {
            res.setRequirementId(story.getRequirement().getId());
            res.setRequirementTitle(story.getRequirement().getTitle());
        }
        if (story.getSprint() != null) {
            res.setSprintId(story.getSprint().getId());
            res.setSprintName(story.getSprint().getName());
        }
        if (story.getRelease() != null) {
            res.setReleaseId(story.getRelease().getId());
            res.setReleaseName(story.getRelease().getName());
        }
        res.setTitle(story.getTitle());
        res.setAsA(story.getAsA());
        res.setIWant(story.getIWant());
        res.setSoThat(story.getSoThat());
        res.setAcceptanceCriteria(story.getAcceptanceCriteria());
        res.setPriority(story.getPriority());
        res.setStoryPoints(story.getStoryPoints());
        res.setStatus(story.getStatus());
        res.setAssignee(UserDto.fromEntity(story.getAssignee()));
        res.setReporter(UserDto.fromEntity(story.getReporter()));
        res.setBusinessValue(story.getBusinessValue());
        res.setCustomerImpact(story.getCustomerImpact());
        res.setUrgency(story.getUrgency());
        res.setComplexity(story.getComplexity());
        res.setPriorityScore(story.getPriorityScore());
        res.setLabels(story.getLabels());
        res.setDueDate(story.getDueDate());
        res.setCreatedAt(story.getCreatedAt());
        res.setUpdatedAt(story.getUpdatedAt());
        return res;
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    public Long getProductId() { return productId; }
    public void setProductId(Long productId) { this.productId = productId; }
    public String getProductTitle() { return productTitle; }
    public void setProductTitle(String productTitle) { this.productTitle = productTitle; }
    public Long getRequirementId() { return requirementId; }
    public void setRequirementId(Long requirementId) { this.requirementId = requirementId; }
    public String getRequirementTitle() { return requirementTitle; }
    public void setRequirementTitle(String requirementTitle) { this.requirementTitle = requirementTitle; }
    public Long getSprintId() { return sprintId; }
    public void setSprintId(Long sprintId) { this.sprintId = sprintId; }
    public String getSprintName() { return sprintName; }
    public void setSprintName(String sprintName) { this.sprintName = sprintName; }
    public Long getReleaseId() { return releaseId; }
    public void setReleaseId(Long releaseId) { this.releaseId = releaseId; }
    public String getReleaseName() { return releaseName; }
    public void setReleaseName(String releaseName) { this.releaseName = releaseName; }
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
    public UserDto getAssignee() { return assignee; }
    public void setAssignee(UserDto assignee) { this.assignee = assignee; }
    public UserDto getReporter() { return reporter; }
    public void setReporter(UserDto reporter) { this.reporter = reporter; }
    public Integer getBusinessValue() { return businessValue; }
    public void setBusinessValue(Integer businessValue) { this.businessValue = businessValue; }
    public Integer getCustomerImpact() { return customerImpact; }
    public void setCustomerImpact(Integer customerImpact) { this.customerImpact = customerImpact; }
    public Integer getUrgency() { return urgency; }
    public void setUrgency(Integer urgency) { this.urgency = urgency; }
    public Integer getComplexity() { return complexity; }
    public void setComplexity(Integer complexity) { this.complexity = complexity; }
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
