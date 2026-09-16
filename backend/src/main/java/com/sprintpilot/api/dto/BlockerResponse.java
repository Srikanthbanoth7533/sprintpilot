package com.sprintpilot.api.dto;

import com.sprintpilot.api.entity.Blocker;
import java.time.LocalDateTime;

public class BlockerResponse {
    private Long id;
    private Long storyId;
    private String storyTitle;
    private String reason;
    private UserDto reportedBy;
    private UserDto resolvedBy;
    private boolean resolved;
    private LocalDateTime createdAt;
    private LocalDateTime resolvedAt;

    public BlockerResponse() {}

    public static BlockerResponse fromEntity(Blocker blocker) {
        if (blocker == null) return null;
        BlockerResponse res = new BlockerResponse();
        res.setId(blocker.getId());
        res.setStoryId(blocker.getUserStory().getId());
        res.setStoryTitle(blocker.getUserStory().getTitle());
        res.setReason(blocker.getReason());
        res.setReportedBy(UserDto.fromEntity(blocker.getReportedBy()));
        res.setResolvedBy(UserDto.fromEntity(blocker.getResolvedBy()));
        res.setResolved(blocker.isResolved());
        res.setCreatedAt(blocker.getCreatedAt());
        res.setResolvedAt(blocker.getResolvedAt());
        return res;
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    public Long getStoryId() { return storyId; }
    public void setStoryId(Long storyId) { this.storyId = storyId; }
    public String getStoryTitle() { return storyTitle; }
    public void setStoryTitle(String storyTitle) { this.storyTitle = storyTitle; }
    public String getReason() { return reason; }
    public void setReason(String reason) { this.reason = reason; }
    public UserDto getReportedBy() { return reportedBy; }
    public void setReportedBy(UserDto reportedBy) { this.reportedBy = reportedBy; }
    public UserDto getResolvedBy() { return resolvedBy; }
    public void setResolvedBy(UserDto resolvedBy) { this.resolvedBy = resolvedBy; }
    public boolean isResolved() { return resolved; }
    public void setResolved(boolean resolved) { this.resolved = resolved; }
    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }
    public LocalDateTime getResolvedAt() { return resolvedAt; }
    public void setResolvedAt(LocalDateTime resolvedAt) { this.resolvedAt = resolvedAt; }
}
