package com.sprintpilot.api.controller;

import com.sprintpilot.api.dto.DashboardMetricsResponse;
import com.sprintpilot.api.service.AnalyticsService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/analytics")
@Tag(name = "Analytics", description = "Engineering and product KPI dashboard metrics, velocity, and distribution")
public class AnalyticsController {

    @Autowired
    private AnalyticsService analyticsService;

    @GetMapping("/dashboard")
    @Operation(summary = "Get aggregated engineering and product KPI metrics")
    public ResponseEntity<DashboardMetricsResponse> getDashboardMetrics(@RequestParam(required = false) Long productId) {
        return ResponseEntity.ok(analyticsService.getDashboardMetrics(productId));
    }
}
