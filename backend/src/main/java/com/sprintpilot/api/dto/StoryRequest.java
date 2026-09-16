package com.sprintpilot.api.dto;

import com.sprintpilot.api.entity.Priority;
import com.sprintpilot.api.entity.StoryStatus;
import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import java.time.LocalDate;

public class StoryRequest {
    @NotNull
    private Long productId;

    private Long requirementId;
    private Long sprintId;
    private Long releaseId;

    @NotBlank
    private String title;

    private String asA;
    private String iWant;
    private String soThat;
    private String acceptanceCriteria;

    private Priority priority = Priority.MEDIUM;
    private Integer storyPoints = 3;
    private StoryStatus status = StoryStatus.BACKLOG;
    private Long assigneeId;

    @Min(1) @Max(10)
    private Integer businessValue = 5;

    @Min(1) @Max(10)
    private Integer customerImpact = 5;

    @Min(1) @Max(10)
    private Integer urgency = 5;

    @Min(1) @Max(10)
    private Integer complexity = 5;

    private String labels;
    private LocalDate dueDate;

    public StoryRequest() {}

    public Long getProductId() { return productId; }
    public void setProductId(Long productId) { this.productId = productId; }
    public Long getRequirementId() { return requirementId; }
    public void setRequirementId(Long requirementId) { this.requirementId = requirementId; }
    public Long getSprintId() { return sprintId; }
    public void setSprintId(Long sprintId) { this.sprintId = sprintId; }
    public Long getReleaseId() { return releaseId; }
    public void setReleaseId(Long releaseId) { this.releaseId = releaseId; }
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
    public Long getAssigneeId() { return assigneeId; }
    public void setAssigneeId(Long assigneeId) { this.assigneeId = assigneeId; }
    public Integer getBusinessValue() { return businessValue; }
    public void setBusinessValue(Integer businessValue) { this.businessValue = businessValue; }
    public Integer getCustomerImpact() { return customerImpact; }
    public void setCustomerImpact(Integer customerImpact) { this.customerImpact = customerImpact; }
    public Integer getUrgency() { return urgency; }
    public void setUrgency(Integer urgency) { this.urgency = urgency; }
    public Integer getComplexity() { return complexity; }
    public void setComplexity(Integer complexity) { this.complexity = complexity; }
    public String getLabels() { return labels; }
    public void setLabels(String labels) { this.labels = labels; }
    public LocalDate getDueDate() { return dueDate; }
    public void setDueDate(LocalDate dueDate) { this.dueDate = dueDate; }
}
