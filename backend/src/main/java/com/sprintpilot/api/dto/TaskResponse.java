package com.sprintpilot.api.dto;

import com.sprintpilot.api.entity.Task;
import com.sprintpilot.api.entity.TaskStatus;
import java.time.LocalDateTime;

public class TaskResponse {
    private Long id;
    private Long storyId;
    private String storyTitle;
    private String title;
    private String description;
    private TaskStatus status;
    private UserDto assignee;
    private Double estimatedHours;
    private Double loggedHours;
    private LocalDateTime createdAt;

    public TaskResponse() {}

    public static TaskResponse fromEntity(Task task) {
        if (task == null) return null;
        TaskResponse res = new TaskResponse();
        res.setId(task.getId());
        res.setStoryId(task.getUserStory().getId());
        res.setStoryTitle(task.getUserStory().getTitle());
        res.setTitle(task.getTitle());
        res.setDescription(task.getDescription());
        res.setStatus(task.getStatus());
        res.setAssignee(UserDto.fromEntity(task.getAssignee()));
        res.setEstimatedHours(task.getEstimatedHours());
        res.setLoggedHours(task.getLoggedHours());
        res.setCreatedAt(task.getCreatedAt());
        return res;
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    public Long getStoryId() { return storyId; }
    public void setStoryId(Long storyId) { this.storyId = storyId; }
    public String getStoryTitle() { return storyTitle; }
    public void setStoryTitle(String storyTitle) { this.storyTitle = storyTitle; }
    public String getTitle() { return title; }
    public void setTitle(String title) { this.title = title; }
    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }
    public TaskStatus getStatus() { return status; }
    public void setStatus(TaskStatus status) { this.status = status; }
    public UserDto getAssignee() { return assignee; }
    public void setAssignee(UserDto assignee) { this.assignee = assignee; }
    public Double getEstimatedHours() { return estimatedHours; }
    public void setEstimatedHours(Double estimatedHours) { this.estimatedHours = estimatedHours; }
    public Double getLoggedHours() { return loggedHours; }
    public void setLoggedHours(Double loggedHours) { this.loggedHours = loggedHours; }
    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }
}
