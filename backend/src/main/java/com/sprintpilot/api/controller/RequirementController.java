package com.sprintpilot.api.controller;

import com.sprintpilot.api.dto.RequirementRequest;
import com.sprintpilot.api.dto.RequirementResponse;
import com.sprintpilot.api.service.RequirementService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/requirements")
@Tag(name = "Requirements", description = "Manage product requirements and PRDs")
public class RequirementController {

    @Autowired
    private RequirementService requirementService;

    @GetMapping("/product/{productId}")
    @Operation(summary = "Get all requirements for a product")
    public ResponseEntity<List<RequirementResponse>> getRequirementsByProduct(@PathVariable Long productId) {
        return ResponseEntity.ok(requirementService.getRequirementsByProduct(productId));
    }

    @PostMapping
    @PreAuthorize("hasAnyRole('ADMIN', 'PRODUCT_MANAGER')")
    @Operation(summary = "Create a product requirement (Admin or Product Manager only)")
    public ResponseEntity<RequirementResponse> createRequirement(@Valid @RequestBody RequirementRequest req) {
        return ResponseEntity.ok(requirementService.createRequirement(req));
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasAnyRole('ADMIN', 'PRODUCT_MANAGER')")
    @Operation(summary = "Update a requirement (Admin or Product Manager only)")
    public ResponseEntity<RequirementResponse> updateRequirement(@PathVariable Long id, @Valid @RequestBody RequirementRequest req) {
        return ResponseEntity.ok(requirementService.updateRequirement(id, req));
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasAnyRole('ADMIN', 'PRODUCT_MANAGER')")
    @Operation(summary = "Delete a requirement (Admin or Product Manager only)")
    public ResponseEntity<Void> deleteRequirement(@PathVariable Long id) {
        requirementService.deleteRequirement(id);
        return ResponseEntity.noContent().build();
    }
}
