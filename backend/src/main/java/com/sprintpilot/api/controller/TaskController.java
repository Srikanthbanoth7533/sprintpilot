package com.sprintpilot.api.controller;

import com.sprintpilot.api.dto.TaskRequest;
import com.sprintpilot.api.dto.TaskResponse;
import com.sprintpilot.api.entity.TaskStatus;
import com.sprintpilot.api.service.TaskService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/tasks")
@Tag(name = "Tasks", description = "Sub-tasks inside user stories")
public class TaskController {

    @Autowired
    private TaskService taskService;

    @GetMapping("/story/{storyId}")
    @Operation(summary = "Get tasks by user story ID")
    public ResponseEntity<List<TaskResponse>> getTasksByStory(@PathVariable Long storyId) {
        return ResponseEntity.ok(taskService.getTasksByStory(storyId));
    }

    @PostMapping
    @Operation(summary = "Create task for a user story")
    public ResponseEntity<TaskResponse> createTask(@Valid @RequestBody TaskRequest req) {
        return ResponseEntity.ok(taskService.createTask(req));
    }

    @PutMapping("/{id}/status")
    @Operation(summary = "Update task status")
    public ResponseEntity<TaskResponse> updateTaskStatus(@PathVariable Long id, @RequestParam TaskStatus status) {
        return ResponseEntity.ok(taskService.updateTaskStatus(id, status));
    }

    @DeleteMapping("/{id}")
    @Operation(summary = "Delete task")
    public ResponseEntity<Void> deleteTask(@PathVariable Long id) {
        taskService.deleteTask(id);
        return ResponseEntity.noContent().build();
    }
}
