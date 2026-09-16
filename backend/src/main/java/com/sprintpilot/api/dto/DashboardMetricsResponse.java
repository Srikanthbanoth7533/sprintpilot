package com.sprintpilot.api.dto;

import java.util.List;
import java.util.Map;

public class DashboardMetricsResponse {
    private Long activeProductsCount;
    private SprintResponse activeSprint;
    private Double sprintCompletionRate;
    private Long totalBacklogStories;
    private Long inProgressStories;
    private Long completedStories;
    private Long blockedStories;
    private Long activeBlockersCount;
    private Long activeReleasesCount;
    private Double teamVelocity;
    private Map<String, Long> statusDistribution;
    private Map<String, Long> priorityDistribution;
    private List<Map<String, Object>> velocityTrend;

    public DashboardMetricsResponse() {}

    public Long getActiveProductsCount() { return activeProductsCount; }
    public void setActiveProductsCount(Long activeProductsCount) { this.activeProductsCount = activeProductsCount; }
    public SprintResponse getActiveSprint() { return activeSprint; }
    public void setActiveSprint(SprintResponse activeSprint) { this.activeSprint = activeSprint; }
    public Double getSprintCompletionRate() { return sprintCompletionRate; }
    public void setSprintCompletionRate(Double sprintCompletionRate) { this.sprintCompletionRate = sprintCompletionRate; }
    public Long getTotalBacklogStories() { return totalBacklogStories; }
    public void setTotalBacklogStories(Long totalBacklogStories) { this.totalBacklogStories = totalBacklogStories; }
    public Long getInProgressStories() { return inProgressStories; }
    public void setInProgressStories(Long inProgressStories) { this.inProgressStories = inProgressStories; }
    public Long getCompletedStories() { return completedStories; }
    public void setCompletedStories(Long completedStories) { this.completedStories = completedStories; }
    public Long getBlockedStories() { return blockedStories; }
    public void setBlockedStories(Long blockedStories) { this.blockedStories = blockedStories; }
    public Long getActiveBlockersCount() { return activeBlockersCount; }
    public void setActiveBlockersCount(Long activeBlockersCount) { this.activeBlockersCount = activeBlockersCount; }
    public Long getActiveReleasesCount() { return activeReleasesCount; }
    public void setActiveReleasesCount(Long activeReleasesCount) { this.activeReleasesCount = activeReleasesCount; }
    public Double getTeamVelocity() { return teamVelocity; }
    public void setTeamVelocity(Double teamVelocity) { this.teamVelocity = teamVelocity; }
    public Map<String, Long> getStatusDistribution() { return statusDistribution; }
    public void setStatusDistribution(Map<String, Long> statusDistribution) { this.statusDistribution = statusDistribution; }
    public Map<String, Long> getPriorityDistribution() { return priorityDistribution; }
    public void setPriorityDistribution(Map<String, Long> priorityDistribution) { this.priorityDistribution = priorityDistribution; }
    public List<Map<String, Object>> getVelocityTrend() { return velocityTrend; }
    public void setVelocityTrend(List<Map<String, Object>> velocityTrend) { this.velocityTrend = velocityTrend; }
}
