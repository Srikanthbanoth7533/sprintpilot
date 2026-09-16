package com.sprintpilot.api.dto;

import com.sprintpilot.api.entity.ProductStatus;
import jakarta.validation.constraints.NotBlank;
import java.time.LocalDate;

public class ProductRequest {
    @NotBlank
    private String name;

    private String description;
    private ProductStatus status = ProductStatus.ACTIVE;
    private LocalDate targetReleaseDate;

    public ProductRequest() {}

    public String getName() { return name; }
    public void setName(String name) { this.name = name; }

    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }

    public ProductStatus getStatus() { return status; }
    public void setStatus(ProductStatus status) { this.status = status; }

    public LocalDate getTargetReleaseDate() { return targetReleaseDate; }
    public void setTargetReleaseDate(LocalDate targetReleaseDate) { this.targetReleaseDate = targetReleaseDate; }
}
