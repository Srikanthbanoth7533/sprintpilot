package com.sprintpilot.api.service;

import com.sprintpilot.api.dto.CommentRequest;
import com.sprintpilot.api.dto.CommentResponse;
import com.sprintpilot.api.entity.Comment;
import com.sprintpilot.api.entity.User;
import com.sprintpilot.api.entity.UserStory;
import com.sprintpilot.api.exception.ResourceNotFoundException;
import com.sprintpilot.api.repository.CommentRepository;
import com.sprintpilot.api.repository.UserStoryRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class CommentService {

    @Autowired
    private CommentRepository commentRepository;

    @Autowired
    private UserStoryRepository userStoryRepository;

    @Autowired
    private AuthService authService;

    @Transactional(readOnly = true)
    public List<CommentResponse> getCommentsByStory(Long storyId) {
        return commentRepository.findByUserStoryIdOrderByCreatedAtAsc(storyId).stream()
                .map(CommentResponse::fromEntity)
                .collect(Collectors.toList());
    }

    @Transactional
    public CommentResponse addComment(CommentRequest req) {
        UserStory story = userStoryRepository.findById(req.getStoryId())
                .orElseThrow(() -> new ResourceNotFoundException("User story not found with id: " + req.getStoryId()));

        User currentUser = authService.getCurrentUser();

        Comment comment = new Comment(story, currentUser, req.getContent());
        comment = commentRepository.save(comment);

        return CommentResponse.fromEntity(comment);
    }
}
