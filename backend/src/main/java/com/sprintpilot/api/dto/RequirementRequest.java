package com.sprintpilot.api.dto;

import com.sprintpilot.api.entity.Priority;
import com.sprintpilot.api.entity.RequirementStatus;
import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

public class RequirementRequest {
    @NotNull
    private Long productId;

    @NotBlank
    private String title;

    private String description;

    @Min(1) @Max(10)
    private Integer businessValue = 5;

    private Priority priority = Priority.MEDIUM;
    private RequirementStatus status = RequirementStatus.DRAFT;
    private String stakeholder;
    private String targetRelease;

    public RequirementRequest() {}

    public Long getProductId() { return productId; }
    public void setProductId(Long productId) { this.productId = productId; }

    public String getTitle() { return title; }
    public void setTitle(String title) { this.title = title; }

    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }

    public Integer getBusinessValue() { return businessValue; }
    public void setBusinessValue(Integer businessValue) { this.businessValue = businessValue; }

    public Priority getPriority() { return priority; }
    public void setPriority(Priority priority) { this.priority = priority; }

    public RequirementStatus getStatus() { return status; }
    public void setStatus(RequirementStatus status) { this.status = status; }

    public String getStakeholder() { return stakeholder; }
    public void setStakeholder(String stakeholder) { this.stakeholder = stakeholder; }

    public String getTargetRelease() { return targetRelease; }
    public void setTargetRelease(String targetRelease) { this.targetRelease = targetRelease; }
}
