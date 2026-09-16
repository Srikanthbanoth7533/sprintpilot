package com.sprintpilot.api.controller;

import com.sprintpilot.api.dto.StoryPrioritizationRequest;
import com.sprintpilot.api.dto.StoryRequest;
import com.sprintpilot.api.dto.StoryResponse;
import com.sprintpilot.api.dto.StoryStatusUpdateRequest;
import com.sprintpilot.api.service.UserStoryService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/stories")
@Tag(name = "User Stories", description = "Backlog refinement, prioritization, Kanban transitions, and story management")
public class UserStoryController {

    @Autowired
    private UserStoryService storyService;

    @GetMapping("/product/{productId}")
    @Operation(summary = "Get prioritized product backlog stories")
    public ResponseEntity<List<StoryResponse>> getBacklogByProduct(@PathVariable Long productId) {
        return ResponseEntity.ok(storyService.getBacklogByProduct(productId));
    }

    @GetMapping("/sprint/{sprintId}")
    @Operation(summary = "Get stories assigned to a specific sprint")
    public ResponseEntity<List<StoryResponse>> getStoriesBySprint(@PathVariable Long sprintId) {
        return ResponseEntity.ok(storyService.getStoriesBySprint(sprintId));
    }

    @GetMapping("/{id}")
    @Operation(summary = "Get story by ID")
    public ResponseEntity<StoryResponse> getStoryById(@PathVariable Long id) {
        return ResponseEntity.ok(storyService.getStoryById(id));
    }

    @PostMapping
    @PreAuthorize("hasAnyRole('ADMIN', 'PRODUCT_MANAGER')")
    @Operation(summary = "Create user story (Admin or Product Manager)")
    public ResponseEntity<StoryResponse> createStory(@Valid @RequestBody StoryRequest req) {
        return ResponseEntity.ok(storyService.createStory(req));
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasAnyRole('ADMIN', 'PRODUCT_MANAGER', 'DEVELOPER')")
    @Operation(summary = "Update user story details")
    public ResponseEntity<StoryResponse> updateStory(@PathVariable Long id, @Valid @RequestBody StoryRequest req) {
        return ResponseEntity.ok(storyService.updateStory(id, req));
    }

    @PutMapping("/{id}/status")
    @PreAuthorize("hasAnyRole('ADMIN', 'PRODUCT_MANAGER', 'DEVELOPER')")
    @Operation(summary = "Update story status (Kanban column drag and drop transition)")
    public ResponseEntity<StoryResponse> updateStoryStatus(@PathVariable Long id, @Valid @RequestBody StoryStatusUpdateRequest req) {
        return ResponseEntity.ok(storyService.updateStoryStatus(id, req));
    }

    @PutMapping("/{id}/prioritize")
    @PreAuthorize("hasAnyRole('ADMIN', 'PRODUCT_MANAGER')")
    @Operation(summary = "Update prioritization factors (Business Value, Impact, Urgency, Complexity)")
    public ResponseEntity<StoryResponse> updateStoryPrioritization(@PathVariable Long id, @Valid @RequestBody StoryPrioritizationRequest req) {
        return ResponseEntity.ok(storyService.updateStoryPrioritization(id, req));
    }

    @PutMapping("/{id}/assign-sprint/{sprintId}")
    @PreAuthorize("hasAnyRole('ADMIN', 'PRODUCT_MANAGER')")
    @Operation(summary = "Assign or reassign story to a sprint")
    public ResponseEntity<StoryResponse> assignToSprint(@PathVariable Long id, @PathVariable Long sprintId) {
        return ResponseEntity.ok(storyService.assignToSprint(id, sprintId));
    }

    @PutMapping("/{id}/remove-sprint")
    @PreAuthorize("hasAnyRole('ADMIN', 'PRODUCT_MANAGER')")
    @Operation(summary = "Remove story from sprint back to backlog")
    public ResponseEntity<StoryResponse> removeFromSprint(@PathVariable Long id) {
        return ResponseEntity.ok(storyService.assignToSprint(id, null));
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasAnyRole('ADMIN', 'PRODUCT_MANAGER')")
    @Operation(summary = "Delete user story")
    public ResponseEntity<Void> deleteStory(@PathVariable Long id) {
        storyService.deleteStory(id);
        return ResponseEntity.noContent().build();
    }
}
