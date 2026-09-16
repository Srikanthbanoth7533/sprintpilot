package com.sprintpilot.api.dto;

import com.sprintpilot.api.entity.Sprint;
import com.sprintpilot.api.entity.SprintStatus;
import java.time.LocalDate;
import java.time.LocalDateTime;

public class SprintResponse {
    private Long id;
    private Long productId;
    private String productTitle;
    private String name;
    private String goal;
    private LocalDate startDate;
    private LocalDate endDate;
    private SprintStatus status;
    private Integer totalPoints;
    private Integer completedPoints;
    private Integer remainingPoints;
    private Double completionPercentage;
    private Long totalStories;
    private Long completedStories;
    private LocalDateTime createdAt;

    public SprintResponse() {}

    public static SprintResponse fromEntity(Sprint sprint) {
        if (sprint == null) return null;
        SprintResponse res = new SprintResponse();
        res.setId(sprint.getId());
        res.setProductId(sprint.getProduct().getId());
        res.setProductTitle(sprint.getProduct().getName());
        res.setName(sprint.getName());
        res.setGoal(sprint.getGoal());
        res.setStartDate(sprint.getStartDate());
        res.setEndDate(sprint.getEndDate());
        res.setStatus(sprint.getStatus());
        int total = sprint.getTotalPoints() != null ? sprint.getTotalPoints() : 0;
        int completed = sprint.getCompletedPoints() != null ? sprint.getCompletedPoints() : 0;
        res.setTotalPoints(total);
        res.setCompletedPoints(completed);
        res.setRemainingPoints(Math.max(0, total - completed));
        res.setCompletionPercentage(total > 0 ? Math.round(((double) completed / total * 100.0) * 10.0) / 10.0 : 0.0);
        res.setCreatedAt(sprint.getCreatedAt());
        return res;
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    public Long getProductId() { return productId; }
    public void setProductId(Long productId) { this.productId = productId; }
    public String getProductTitle() { return productTitle; }
    public void setProductTitle(String productTitle) { this.productTitle = productTitle; }
    public String getName() { return name; }
    public void setName(String name) { this.name = name; }
    public String getGoal() { return goal; }
    public void setGoal(String goal) { this.goal = goal; }
    public LocalDate getStartDate() { return startDate; }
    public void setStartDate(LocalDate startDate) { this.startDate = startDate; }
    public LocalDate getEndDate() { return endDate; }
    public void setEndDate(LocalDate endDate) { this.endDate = endDate; }
    public SprintStatus getStatus() { return status; }
    public void setStatus(SprintStatus status) { this.status = status; }
    public Integer getTotalPoints() { return totalPoints; }
    public void setTotalPoints(Integer totalPoints) { this.totalPoints = totalPoints; }
    public Integer getCompletedPoints() { return completedPoints; }
    public void setCompletedPoints(Integer completedPoints) { this.completedPoints = completedPoints; }
    public Integer getRemainingPoints() { return remainingPoints; }
    public void setRemainingPoints(Integer remainingPoints) { this.remainingPoints = remainingPoints; }
    public Double getCompletionPercentage() { return completionPercentage; }
    public void setCompletionPercentage(Double completionPercentage) { this.completionPercentage = completionPercentage; }
    public Long getTotalStories() { return totalStories; }
    public void setTotalStories(Long totalStories) { this.totalStories = totalStories; }
    public Long getCompletedStories() { return completedStories; }
    public void setCompletedStories(Long completedStories) { this.completedStories = completedStories; }
    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }
}
