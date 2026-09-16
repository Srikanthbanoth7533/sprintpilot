package com.sprintpilot.api.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

public class BlockerRequest {
    @NotNull
    private Long storyId;

    @NotBlank
    private String reason;

    public BlockerRequest() {}

    public Long getStoryId() { return storyId; }
    public void setStoryId(Long storyId) { this.storyId = storyId; }
    public String getReason() { return reason; }
    public void setReason(String reason) { this.reason = reason; }
}
