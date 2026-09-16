package com.sprintpilot.api.dto;

import com.sprintpilot.api.entity.Priority;
import com.sprintpilot.api.entity.Requirement;
import com.sprintpilot.api.entity.RequirementStatus;
import java.time.LocalDateTime;

public class RequirementResponse {
    private Long id;
    private Long productId;
    private String productTitle;
    private String title;
    private String description;
    private Integer businessValue;
    private Priority priority;
    private RequirementStatus status;
    private String stakeholder;
    private String targetRelease;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;

    public RequirementResponse() {}

    public static RequirementResponse fromEntity(Requirement req) {
        if (req == null) return null;
        RequirementResponse res = new RequirementResponse();
        res.setId(req.getId());
        res.setProductId(req.getProduct().getId());
        res.setProductTitle(req.getProduct().getName());
        res.setTitle(req.getTitle());
        res.setDescription(req.getDescription());
        res.setBusinessValue(req.getBusinessValue());
        res.setPriority(req.getPriority());
        res.setStatus(req.getStatus());
        res.setStakeholder(req.getStakeholder());
        res.setTargetRelease(req.getTargetRelease());
        res.setCreatedAt(req.getCreatedAt());
        res.setUpdatedAt(req.getUpdatedAt());
        return res;
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    public Long getProductId() { return productId; }
    public void setProductId(Long productId) { this.productId = productId; }
    public String getProductTitle() { return productTitle; }
    public void setProductTitle(String productTitle) { this.productTitle = productTitle; }
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
    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }
    public LocalDateTime getUpdatedAt() { return updatedAt; }
    public void setUpdatedAt(LocalDateTime updatedAt) { this.updatedAt = updatedAt; }
}
