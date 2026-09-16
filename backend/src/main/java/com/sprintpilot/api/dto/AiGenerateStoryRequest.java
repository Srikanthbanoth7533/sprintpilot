package com.sprintpilot.api.dto;

import jakarta.validation.constraints.NotBlank;

public class AiGenerateStoryRequest {
    @NotBlank
    private String prompt;

    private Long productId;

    public AiGenerateStoryRequest() {}
    public AiGenerateStoryRequest(String prompt) {
        this.prompt = prompt;
    }

    public String getPrompt() { return prompt; }
    public void setPrompt(String prompt) { this.prompt = prompt; }
    public Long getProductId() { return productId; }
    public void setProductId(Long productId) { this.productId = productId; }
}
