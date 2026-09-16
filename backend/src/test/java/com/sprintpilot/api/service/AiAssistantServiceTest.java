package com.sprintpilot.api.service;

import com.sprintpilot.api.dto.AiGenerateStoryRequest;
import com.sprintpilot.api.dto.AiGenerateStoryResponse;
import com.sprintpilot.api.entity.Priority;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;

import static org.junit.jupiter.api.Assertions.*;

class AiAssistantServiceTest {

    private final AiAssistantService aiService = new AiAssistantService();

    @Test
    @DisplayName("Should generate structured user story and acceptance criteria for student notification prompt")
    void testStudentNotificationPrompt() {
        AiGenerateStoryRequest req = new AiGenerateStoryRequest(
                "We need a feature that allows students to receive notifications when their assignment deadline is approaching."
        );

        AiGenerateStoryResponse response = aiService.generateStory(req);

        assertNotNull(response);
        assertEquals("Student", response.getAsA());
        assertTrue(response.getUserStory().contains("As a Student"));
        assertTrue(response.getUserStory().contains("assignment deadline"));
        assertNotNull(response.getAcceptanceCriteria());
        assertFalse(response.getAcceptanceCriteria().isEmpty());
        assertTrue(response.getAcceptanceCriteria().get(0).startsWith("Given"));
        assertNotNull(response.getSuggestedPriority());
        assertTrue(response.getSuggestedStoryPoints() > 0);
        assertTrue(response.getSuggestedLabels().contains("notifications"));
    }

    @Test
    @DisplayName("Should gracefully handle payment prompt and suggest appropriate story points")
    void testPaymentPrompt() {
        AiGenerateStoryRequest req = new AiGenerateStoryRequest(
                "We need Stripe and UPI checkout integration with instant refunds"
        );

        AiGenerateStoryResponse response = aiService.generateStory(req);

        assertNotNull(response);
        assertTrue(response.getUserStory().contains("checkout"));
        assertEquals(8, response.getSuggestedStoryPoints()); // Payments is higher complexity
        assertTrue(response.getSuggestedLabels().contains("payments"));
    }
}
