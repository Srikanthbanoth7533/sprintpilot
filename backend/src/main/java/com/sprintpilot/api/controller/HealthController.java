package com.sprintpilot.api.controller;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api")
@Tag(name = "Health", description = "System uptime and status check")
public class HealthController {

    @GetMapping("/health")
    @Operation(summary = "Liveness and health check endpoint")
    public ResponseEntity<Map<String, Object>> checkHealth() {
        Map<String, Object> status = new HashMap<>();
        status.put("status", "UP");
        status.put("service", "sprintpilot-api");
        status.put("version", "1.0.0");
        status.put("timestamp", LocalDateTime.now());
        return ResponseEntity.ok(status);
    }
}
