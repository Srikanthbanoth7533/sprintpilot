package com.sprintpilot.api.service;

import com.sprintpilot.api.dto.RequirementRequest;
import com.sprintpilot.api.dto.RequirementResponse;
import com.sprintpilot.api.entity.Product;
import com.sprintpilot.api.entity.Requirement;
import com.sprintpilot.api.exception.ResourceNotFoundException;
import com.sprintpilot.api.repository.ProductRepository;
import com.sprintpilot.api.repository.RequirementRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class RequirementService {

    @Autowired
    private RequirementRepository requirementRepository;

    @Autowired
    private ProductRepository productRepository;

    @Transactional(readOnly = true)
    public List<RequirementResponse> getRequirementsByProduct(Long productId) {
        return requirementRepository.findByProductIdOrderByCreatedAtDesc(productId).stream()
                .map(RequirementResponse::fromEntity)
                .collect(Collectors.toList());
    }

    @Transactional
    public RequirementResponse createRequirement(RequirementRequest req) {
        Product product = productRepository.findById(req.getProductId())
                .orElseThrow(() -> new ResourceNotFoundException("Product not found with id: " + req.getProductId()));

        Requirement requirement = new Requirement(
                product,
                req.getTitle(),
                req.getDescription(),
                req.getBusinessValue(),
                req.getPriority(),
                req.getStatus(),
                req.getStakeholder(),
                req.getTargetRelease()
        );

        requirement = requirementRepository.save(requirement);
        return RequirementResponse.fromEntity(requirement);
    }

    @Transactional
    public RequirementResponse updateRequirement(Long id, RequirementRequest req) {
        Requirement requirement = requirementRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Requirement not found with id: " + id));

        requirement.setTitle(req.getTitle());
        requirement.setDescription(req.getDescription());
        requirement.setBusinessValue(req.getBusinessValue());
        requirement.setPriority(req.getPriority());
        requirement.setStatus(req.getStatus());
        requirement.setStakeholder(req.getStakeholder());
        requirement.setTargetRelease(req.getTargetRelease());

        requirement = requirementRepository.save(requirement);
        return RequirementResponse.fromEntity(requirement);
    }

    @Transactional
    public void deleteRequirement(Long id) {
        Requirement requirement = requirementRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Requirement not found with id: " + id));
        requirementRepository.delete(requirement);
    }
}
