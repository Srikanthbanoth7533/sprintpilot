package com.sprintpilot.api.repository;

import com.sprintpilot.api.entity.Release;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface ReleaseRepository extends JpaRepository<Release, Long> {
    List<Release> findByProductIdOrderByTargetDateAsc(Long productId);
}
