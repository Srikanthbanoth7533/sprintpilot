package com.sprintpilot.api.controller;

import com.sprintpilot.api.dto.UserDto;
import com.sprintpilot.api.service.TeamService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api")
@Tag(name = "Teams & Users", description = "Team workloads and member rosters")
public class TeamController {

    @Autowired
    private TeamService teamService;

    @GetMapping("/teams")
    @Operation(summary = "Get all teams with roster")
    public ResponseEntity<List<Map<String, Object>>> getAllTeams() {
        return ResponseEntity.ok(teamService.getAllTeams());
    }

    @GetMapping("/users")
    @Operation(summary = "Get all users (for assignment dropdowns)")
    public ResponseEntity<List<UserDto>> getAllUsers() {
        return ResponseEntity.ok(teamService.getAllUsers());
    }
}
