package com.sprintpilot.api.dto;

import com.sprintpilot.api.entity.Release;
import com.sprintpilot.api.entity.ReleaseStatus;
import java.time.LocalDate;
import java.time.LocalDateTime;

public class ReleaseResponse {
    private Long id;
    private Long productId;
    private String productTitle;
    private String version;
    private String name;
    private String description;
    private LocalDate targetDate;
    private ReleaseStatus status;
    private Long storyCount;
    private Long completedStoryCount;
    private LocalDateTime createdAt;

    public ReleaseResponse() {}

    public static ReleaseResponse fromEntity(Release release) {
        if (release == null) return null;
        ReleaseResponse res = new ReleaseResponse();
        res.setId(release.getId());
        res.setProductId(release.getProduct().getId());
        res.setProductTitle(release.getProduct().getName());
        res.setVersion(release.getVersion());
        res.setName(release.getName());
        res.setDescription(release.getDescription());
        res.setTargetDate(release.getTargetDate());
        res.setStatus(release.getStatus());
        res.setCreatedAt(release.getCreatedAt());
        return res;
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    public Long getProductId() { return productId; }
    public void setProductId(Long productId) { this.productId = productId; }
    public String getProductTitle() { return productTitle; }
    public void setProductTitle(String productTitle) { this.productTitle = productTitle; }
    public String getVersion() { return version; }
    public void setVersion(String version) { this.version = version; }
    public String getName() { return name; }
    public void setName(String name) { this.name = name; }
    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }
    public LocalDate getTargetDate() { return targetDate; }
    public void setTargetDate(LocalDate targetDate) { this.targetDate = targetDate; }
    public ReleaseStatus getStatus() { return status; }
    public void setStatus(ReleaseStatus status) { this.status = status; }
    public Long getStoryCount() { return storyCount; }
    public void setStoryCount(Long storyCount) { this.storyCount = storyCount; }
    public Long getCompletedStoryCount() { return completedStoryCount; }
    public void setCompletedStoryCount(Long completedStoryCount) { this.completedStoryCount = completedStoryCount; }
    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }
}
