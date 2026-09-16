package com.sprintpilot.api.controller;

import com.sprintpilot.api.dto.BlockerRequest;
import com.sprintpilot.api.dto.BlockerResponse;
import com.sprintpilot.api.service.BlockerService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/blockers")
@Tag(name = "Blockers", description = "Track and resolve sprint obstacles and dependencies")
public class BlockerController {

    @Autowired
    private BlockerService blockerService;

    @GetMapping("/active")
    @Operation(summary = "Get all unresolved blockers")
    public ResponseEntity<List<BlockerResponse>> getActiveBlockers() {
        return ResponseEntity.ok(blockerService.getActiveBlockers());
    }

    @GetMapping("/story/{storyId}")
    @Operation(summary = "Get blockers for a specific story")
    public ResponseEntity<List<BlockerResponse>> getBlockersByStory(@PathVariable Long storyId) {
        return ResponseEntity.ok(blockerService.getBlockersByStory(storyId));
    }

    @PostMapping
    @Operation(summary = "Flag a story as blocked")
    public ResponseEntity<BlockerResponse> createBlocker(@Valid @RequestBody BlockerRequest req) {
        return ResponseEntity.ok(blockerService.createBlocker(req));
    }

    @PutMapping("/{id}/resolve")
    @Operation(summary = "Resolve a blocker")
    public ResponseEntity<BlockerResponse> resolveBlocker(@PathVariable Long id) {
        return ResponseEntity.ok(blockerService.resolveBlocker(id));
    }
}
