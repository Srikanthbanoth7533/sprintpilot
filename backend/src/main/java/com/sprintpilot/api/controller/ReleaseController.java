package com.sprintpilot.api.controller;

import com.sprintpilot.api.dto.ReleaseRequest;
import com.sprintpilot.api.dto.ReleaseResponse;
import com.sprintpilot.api.service.ReleaseService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/releases")
@Tag(name = "Releases", description = "Version tracking, milestone planning, and release progress")
public class ReleaseController {

    @Autowired
    private ReleaseService releaseService;

    @GetMapping("/product/{productId}")
    @Operation(summary = "Get all releases for a product")
    public ResponseEntity<List<ReleaseResponse>> getReleasesByProduct(@PathVariable Long productId) {
        return ResponseEntity.ok(releaseService.getReleasesByProduct(productId));
    }

    @PostMapping
    @PreAuthorize("hasAnyRole('ADMIN', 'PRODUCT_MANAGER')")
    @Operation(summary = "Create a release (Admin or Product Manager only)")
    public ResponseEntity<ReleaseResponse> createRelease(@Valid @RequestBody ReleaseRequest req) {
        return ResponseEntity.ok(releaseService.createRelease(req));
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasAnyRole('ADMIN', 'PRODUCT_MANAGER')")
    @Operation(summary = "Update release details")
    public ResponseEntity<ReleaseResponse> updateRelease(@PathVariable Long id, @Valid @RequestBody ReleaseRequest req) {
        return ResponseEntity.ok(releaseService.updateRelease(id, req));
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    @Operation(summary = "Delete release")
    public ResponseEntity<Void> deleteRelease(@PathVariable Long id) {
        releaseService.deleteRelease(id);
        return ResponseEntity.noContent().build();
    }
}
