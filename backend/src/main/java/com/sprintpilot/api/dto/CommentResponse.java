package com.sprintpilot.api.dto;

import com.sprintpilot.api.entity.Comment;
import java.time.LocalDateTime;

public class CommentResponse {
    private Long id;
    private Long storyId;
    private UserDto author;
    private String content;
    private LocalDateTime createdAt;

    public CommentResponse() {}

    public static CommentResponse fromEntity(Comment comment) {
        if (comment == null) return null;
        CommentResponse res = new CommentResponse();
        res.setId(comment.getId());
        res.setStoryId(comment.getUserStory().getId());
        res.setAuthor(UserDto.fromEntity(comment.getAuthor()));
        res.setContent(comment.getContent());
        res.setCreatedAt(comment.getCreatedAt());
        return res;
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    public Long getStoryId() { return storyId; }
    public void setStoryId(Long storyId) { this.storyId = storyId; }
    public UserDto getAuthor() { return author; }
    public void setAuthor(UserDto author) { this.author = author; }
    public String getContent() { return content; }
    public void setContent(String content) { this.content = content; }
    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }
}
