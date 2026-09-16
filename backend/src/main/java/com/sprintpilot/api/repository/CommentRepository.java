package com.sprintpilot.api.repository;

import com.sprintpilot.api.entity.Comment;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface CommentRepository extends JpaRepository<Comment, Long> {
    List<Comment> findByUserStoryIdOrderByCreatedAtAsc(Long storyId);
}
