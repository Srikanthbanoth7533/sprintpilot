package com.sprintpilot.api.service;

import com.sprintpilot.api.entity.UserStory;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;

import static org.junit.jupiter.api.Assertions.assertEquals;

class PrioritizationTest {

    @Test
    @DisplayName("Should correctly calculate Priority Score using explainable business formula")
    void testPriorityScoreCalculation() {
        UserStory story = new UserStory();
        story.setBusinessValue(8);    // 8 * 1.5 = 12.0
        story.setCustomerImpact(9);   // 9 * 1.2 = 10.8
        story.setUrgency(7);          // 7 * 1.0 = 7.0
        story.setComplexity(4);       // 4 * 0.8 = 3.2
        // Expected: 12.0 + 10.8 + 7.0 - 3.2 = 26.6

        story.calculatePriorityScore();

        assertEquals(26.6, story.getPriorityScore(), 0.01);
    }

    @Test
    @DisplayName("Should handle boundary values (min and max) accurately")
    void testBoundaryCalculations() {
        UserStory minStory = new UserStory();
        minStory.setBusinessValue(1);    // 1.5
        minStory.setCustomerImpact(1);   // 1.2
        minStory.setUrgency(1);          // 1.0
        minStory.setComplexity(10);      // 8.0
        // Expected: 1.5 + 1.2 + 1.0 - 8.0 = -4.3

        minStory.calculatePriorityScore();
        assertEquals(-4.3, minStory.getPriorityScore(), 0.01);

        UserStory maxStory = new UserStory();
        maxStory.setBusinessValue(10);   // 15.0
        maxStory.setCustomerImpact(10);  // 12.0
        maxStory.setUrgency(10);         // 10.0
        maxStory.setComplexity(1);       // 0.8
        // Expected: 15.0 + 12.0 + 10.0 - 0.8 = 36.2

        maxStory.calculatePriorityScore();
        assertEquals(36.2, maxStory.getPriorityScore(), 0.01);
    }
}
