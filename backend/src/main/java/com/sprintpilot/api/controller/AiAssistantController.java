package com.sprintpilot.api.controller;

import com.sprintpilot.api.dto.AiGenerateStoryRequest;
import com.sprintpilot.api.dto.AiGenerateStoryResponse;
import com.sprintpilot.api.service.AiAssistantService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/ai")
@Tag(name = "AI Product Assistant", description = "Generative agile requirements conversion and story synthesis")
public class AiAssistantController {

    @Autowired
    private AiAssistantService aiAssistantService;

    @PostMapping("/generate-story")
    @PreAuthorize("hasAnyRole('ADMIN', 'PRODUCT_MANAGER')")
    @Operation(summary = "Convert natural language requirement into a structured user story with Gherkin acceptance criteria")
    public ResponseEntity<AiGenerateStoryResponse> generateStory(@Valid @RequestBody AiGenerateStoryRequest req) {
        return ResponseEntity.ok(aiAssistantService.generateStory(req));
    }
}
