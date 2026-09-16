package com.sprintpilot.api.service;

import com.sprintpilot.api.dto.BlockerRequest;
import com.sprintpilot.api.dto.BlockerResponse;
import com.sprintpilot.api.entity.Blocker;
import com.sprintpilot.api.entity.StoryStatus;
import com.sprintpilot.api.entity.User;
import com.sprintpilot.api.entity.UserStory;
import com.sprintpilot.api.exception.ResourceNotFoundException;
import com.sprintpilot.api.repository.BlockerRepository;
import com.sprintpilot.api.repository.UserStoryRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class BlockerService {

    @Autowired
    private BlockerRepository blockerRepository;

    @Autowired
    private UserStoryRepository userStoryRepository;

    @Autowired
    private AuthService authService;

    @Transactional(readOnly = true)
    public List<BlockerResponse> getBlockersByStory(Long storyId) {
        return blockerRepository.findByUserStoryId(storyId).stream()
                .map(BlockerResponse::fromEntity)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public List<BlockerResponse> getActiveBlockers() {
        return blockerRepository.findByResolvedFalse().stream()
                .map(BlockerResponse::fromEntity)
                .collect(Collectors.toList());
    }

    @Transactional
    public BlockerResponse createBlocker(BlockerRequest req) {
        UserStory story = userStoryRepository.findById(req.getStoryId())
                .orElseThrow(() -> new ResourceNotFoundException("User story not found with id: " + req.getStoryId()));

        User currentUser = authService.getCurrentUser();

        Blocker blocker = new Blocker(story, req.getReason(), currentUser);
        blocker = blockerRepository.save(blocker);

        // Mark story status as BLOCKED
        story.setStatus(StoryStatus.BLOCKED);
        userStoryRepository.save(story);

        return BlockerResponse.fromEntity(blocker);
    }

    @Transactional
    public BlockerResponse resolveBlocker(Long id) {
        Blocker blocker = blockerRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Blocker not found with id: " + id));

        User currentUser = authService.getCurrentUser();
        blocker.setResolved(true);
        blocker.setResolvedBy(currentUser);
        blocker.setResolvedAt(LocalDateTime.now());

        blocker = blockerRepository.save(blocker);

        // Check if there are other unresolved blockers for this story
        List<Blocker> remainingBlockers = blockerRepository.findByUserStoryId(blocker.getUserStory().getId()).stream()
                .filter(b -> !b.isResolved())
                .collect(Collectors.toList());

        if (remainingBlockers.isEmpty()) {
            UserStory story = blocker.getUserStory();
            if (story.getStatus() == StoryStatus.BLOCKED) {
                story.setStatus(StoryStatus.IN_PROGRESS);
                userStoryRepository.save(story);
            }
        }

        return BlockerResponse.fromEntity(blocker);
    }
}
