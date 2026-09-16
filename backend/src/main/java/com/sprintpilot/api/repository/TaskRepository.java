package com.sprintpilot.api.repository;

import com.sprintpilot.api.entity.Task;
import com.sprintpilot.api.entity.TaskStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface TaskRepository extends JpaRepository<Task, Long> {
    List<Task> findByUserStoryId(Long storyId);
    List<Task> findByAssigneeId(Long assigneeId);
    long countByStatus(TaskStatus status);
}
