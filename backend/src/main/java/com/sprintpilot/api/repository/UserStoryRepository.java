package com.sprintpilot.api.repository;

import com.sprintpilot.api.entity.StoryStatus;
import com.sprintpilot.api.entity.UserStory;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface UserStoryRepository extends JpaRepository<UserStory, Long> {
    List<UserStory> findByProductIdOrderByPriorityScoreDesc(Long productId);
    List<UserStory> findByProductIdAndStatus(Long productId, StoryStatus status);
    List<UserStory> findBySprintId(Long sprintId);
    List<UserStory> findByRequirementId(Long requirementId);
    List<UserStory> findByReleaseId(Long releaseId);
    List<UserStory> findByAssigneeId(Long assigneeId);

    long countBySprintIdAndStatus(Long sprintId, StoryStatus status);
    long countByProductIdAndStatus(Long productId, StoryStatus status);

    @Query("SELECT coalesce(sum(s.storyPoints), 0) FROM UserStory s WHERE s.sprint.id = :sprintId")
    Integer sumPointsBySprintId(@Param("sprintId") Long sprintId);

    @Query("SELECT coalesce(sum(s.storyPoints), 0) FROM UserStory s WHERE s.sprint.id = :sprintId AND s.status = 'DONE'")
    Integer sumCompletedPointsBySprintId(@Param("sprintId") Long sprintId);

    @Query("SELECT s.status, count(s) FROM UserStory s WHERE s.product.id = :productId GROUP BY s.status")
    List<Object[]> countDistributionByStatus(@Param("productId") Long productId);

    @Query("SELECT s.priority, count(s) FROM UserStory s WHERE s.product.id = :productId GROUP BY s.priority")
    List<Object[]> countDistributionByPriority(@Param("productId") Long productId);
}
