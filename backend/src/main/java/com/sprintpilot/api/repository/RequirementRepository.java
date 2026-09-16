package com.sprintpilot.api.repository;

import com.sprintpilot.api.entity.Requirement;
import com.sprintpilot.api.entity.RequirementStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface RequirementRepository extends JpaRepository<Requirement, Long> {
    List<Requirement> findByProductIdOrderByCreatedAtDesc(Long productId);
    long countByProductIdAndStatus(Long productId, RequirementStatus status);
}
