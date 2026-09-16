package com.sprintpilot.api.dto;

import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotNull;

public class StoryPrioritizationRequest {
    @NotNull @Min(1) @Max(10)
    private Integer businessValue;

    @NotNull @Min(1) @Max(10)
    private Integer customerImpact;

    @NotNull @Min(1) @Max(10)
    private Integer urgency;

    @NotNull @Min(1) @Max(10)
    private Integer complexity;

    public StoryPrioritizationRequest() {}

    public Integer getBusinessValue() { return businessValue; }
    public void setBusinessValue(Integer businessValue) { this.businessValue = businessValue; }
    public Integer getCustomerImpact() { return customerImpact; }
    public void setCustomerImpact(Integer customerImpact) { this.customerImpact = customerImpact; }
    public Integer getUrgency() { return urgency; }
    public void setUrgency(Integer urgency) { this.urgency = urgency; }
    public Integer getComplexity() { return complexity; }
    public void setComplexity(Integer complexity) { this.complexity = complexity; }
}
