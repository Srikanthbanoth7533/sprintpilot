package com.sprintpilot.api.controller;

import com.sprintpilot.api.dto.SprintRequest;
import com.sprintpilot.api.dto.SprintResponse;
import com.sprintpilot.api.service.SprintService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/sprints")
@Tag(name = "Sprints", description = "Sprint lifecycle management, planning, starting, and completing sprints")
public class SprintController {

    @Autowired
    private SprintService sprintService;

    @GetMapping("/product/{productId}")
    @Operation(summary = "Get all sprints for a product")
    public ResponseEntity<List<SprintResponse>> getSprintsByProduct(@PathVariable Long productId) {
        return ResponseEntity.ok(sprintService.getSprintsByProduct(productId));
    }

    @GetMapping("/{id}")
    @Operation(summary = "Get sprint by ID")
    public ResponseEntity<SprintResponse> getSprintById(@PathVariable Long id) {
        return ResponseEntity.ok(sprintService.getSprintById(id));
    }

    @GetMapping("/product/{productId}/active")
    @Operation(summary = "Get active sprint for a product")
    public ResponseEntity<SprintResponse> getActiveSprint(@PathVariable Long productId) {
        SprintResponse active = sprintService.getActiveSprint(productId);
        return active != null ? ResponseEntity.ok(active) : ResponseEntity.noContent().build();
    }

    @PostMapping
    @PreAuthorize("hasAnyRole('ADMIN', 'PRODUCT_MANAGER')")
    @Operation(summary = "Create a new sprint (Admin or Product Manager only)")
    public ResponseEntity<SprintResponse> createSprint(@Valid @RequestBody SprintRequest req) {
        return ResponseEntity.ok(sprintService.createSprint(req));
    }

    @PutMapping("/{id}/start")
    @PreAuthorize("hasAnyRole('ADMIN', 'PRODUCT_MANAGER')")
    @Operation(summary = "Start sprint cycle (Admin or Product Manager only)")
    public ResponseEntity<SprintResponse> startSprint(@PathVariable Long id) {
        return ResponseEntity.ok(sprintService.startSprint(id));
    }

    @PutMapping("/{id}/complete")
    @PreAuthorize("hasAnyRole('ADMIN', 'PRODUCT_MANAGER')")
    @Operation(summary = "Complete active sprint cycle (Admin or Product Manager only)")
    public ResponseEntity<SprintResponse> completeSprint(@PathVariable Long id) {
        return ResponseEntity.ok(sprintService.completeSprint(id));
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    @Operation(summary = "Delete sprint (Admin only)")
    public ResponseEntity<Void> deleteSprint(@PathVariable Long id) {
        sprintService.deleteSprint(id);
        return ResponseEntity.noContent().build();
    }
}
