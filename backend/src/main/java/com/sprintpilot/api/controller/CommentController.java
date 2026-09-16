package com.sprintpilot.api.controller;

import com.sprintpilot.api.dto.CommentRequest;
import com.sprintpilot.api.dto.CommentResponse;
import com.sprintpilot.api.service.CommentService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/comments")
@Tag(name = "Comments", description = "Collaboration and discussion on user stories")
public class CommentController {

    @Autowired
    private CommentService commentService;

    @GetMapping("/story/{storyId}")
    @Operation(summary = "Get all comments for a story")
    public ResponseEntity<List<CommentResponse>> getCommentsByStory(@PathVariable Long storyId) {
        return ResponseEntity.ok(commentService.getCommentsByStory(storyId));
    }

    @PostMapping
    @Operation(summary = "Add a comment to a story")
    public ResponseEntity<CommentResponse> addComment(@Valid @RequestBody CommentRequest req) {
        return ResponseEntity.ok(commentService.addComment(req));
    }
}
