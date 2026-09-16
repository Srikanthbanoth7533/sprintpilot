package com.sprintpilot.api.dto;

import com.sprintpilot.api.entity.Product;
import com.sprintpilot.api.entity.ProductStatus;
import java.time.LocalDate;
import java.time.LocalDateTime;

public class ProductResponse {
    private Long id;
    private String name;
    private String slug;
    private String description;
    private ProductStatus status;
    private UserDto owner;
    private LocalDate targetReleaseDate;
    private Long activeSprintCount;
    private Long totalStoriesCount;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;

    public ProductResponse() {}

    public static ProductResponse fromEntity(Product product) {
        if (product == null) return null;
        ProductResponse res = new ProductResponse();
        res.setId(product.getId());
        res.setName(product.getName());
        res.setSlug(product.getSlug());
        res.setDescription(product.getDescription());
        res.setStatus(product.getStatus());
        res.setOwner(UserDto.fromEntity(product.getOwner()));
        res.setTargetReleaseDate(product.getTargetReleaseDate());
        res.setCreatedAt(product.getCreatedAt());
        res.setUpdatedAt(product.getUpdatedAt());
        return res;
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    public String getName() { return name; }
    public void setName(String name) { this.name = name; }
    public String getSlug() { return slug; }
    public void setSlug(String slug) { this.slug = slug; }
    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }
    public ProductStatus getStatus() { return status; }
    public void setStatus(ProductStatus status) { this.status = status; }
    public UserDto getOwner() { return owner; }
    public void setOwner(UserDto owner) { this.owner = owner; }
    public LocalDate getTargetReleaseDate() { return targetReleaseDate; }
    public void setTargetReleaseDate(LocalDate targetReleaseDate) { this.targetReleaseDate = targetReleaseDate; }
    public Long getActiveSprintCount() { return activeSprintCount; }
    public void setActiveSprintCount(Long activeSprintCount) { this.activeSprintCount = activeSprintCount; }
    public Long getTotalStoriesCount() { return totalStoriesCount; }
    public void setTotalStoriesCount(Long totalStoriesCount) { this.totalStoriesCount = totalStoriesCount; }
    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }
    public LocalDateTime getUpdatedAt() { return updatedAt; }
    public void setUpdatedAt(LocalDateTime updatedAt) { this.updatedAt = updatedAt; }
}
