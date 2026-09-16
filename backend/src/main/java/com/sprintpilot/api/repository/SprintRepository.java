package com.sprintpilot.api.repository;

import com.sprintpilot.api.entity.Sprint;
import com.sprintpilot.api.entity.SprintStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;
import java.util.Optional;

@Repository
public interface SprintRepository extends JpaRepository<Sprint, Long> {
    List<Sprint> findByProductIdOrderByCreatedAtDesc(Long productId);
    List<Sprint> findByProductIdAndStatus(Long productId, SprintStatus status);
    Optional<Sprint> findFirstByProductIdAndStatusOrderByStartDateDesc(Long productId, SprintStatus status);
}
