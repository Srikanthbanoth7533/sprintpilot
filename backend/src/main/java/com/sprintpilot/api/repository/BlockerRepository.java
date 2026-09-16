package com.sprintpilot.api.repository;

import com.sprintpilot.api.entity.Blocker;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface BlockerRepository extends JpaRepository<Blocker, Long> {
    List<Blocker> findByUserStoryId(Long storyId);
    List<Blocker> findByResolvedFalse();
    long countByResolvedFalse();
}
