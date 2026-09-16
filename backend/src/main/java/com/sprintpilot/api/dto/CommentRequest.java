package com.sprintpilot.api.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

public class CommentRequest {
    @NotNull
    private Long storyId;

    @NotBlank
    private String content;

    public CommentRequest() {}

    public Long getStoryId() { return storyId; }
    public void setStoryId(Long storyId) { this.storyId = storyId; }
    public String getContent() { return content; }
    public void setContent(String content) { this.content = content; }
}
