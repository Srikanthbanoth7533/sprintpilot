package com.sprintpilot.api.dto;

import com.sprintpilot.api.entity.StoryStatus;
import jakarta.validation.constraints.NotNull;

public class StoryStatusUpdateRequest {
    @NotNull
    private StoryStatus status;

    public StoryStatusUpdateRequest() {}
    public StoryStatusUpdateRequest(StoryStatus status) {
        this.status = status;
    }

    public StoryStatus getStatus() { return status; }
    public void setStatus(StoryStatus status) { this.status = status; }
}
