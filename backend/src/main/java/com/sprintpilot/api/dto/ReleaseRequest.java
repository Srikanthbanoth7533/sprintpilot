package com.sprintpilot.api.dto;

import com.sprintpilot.api.entity.ReleaseStatus;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import java.time.LocalDate;

public class ReleaseRequest {
    @NotNull
    private Long productId;

    @NotBlank
    private String version;

    @NotBlank
    private String name;

    private String description;
    private LocalDate targetDate;
    private ReleaseStatus status = ReleaseStatus.PLANNED;

    public ReleaseRequest() {}

    public Long getProductId() { return productId; }
    public void setProductId(Long productId) { this.productId = productId; }
    public String getVersion() { return version; }
    public void setVersion(String version) { this.version = version; }
    public String getName() { return name; }
    public void setName(String name) { this.name = name; }
    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }
    public LocalDate getTargetDate() { return targetDate; }
    public void setTargetDate(LocalDate targetDate) { this.targetDate = targetDate; }
    public ReleaseStatus getStatus() { return status; }
    public void setStatus(ReleaseStatus status) { this.status = status; }
}
