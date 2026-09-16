package com.sprintpilot.api.service;

import com.sprintpilot.api.dto.StoryPrioritizationRequest;
import com.sprintpilot.api.dto.StoryRequest;
import com.sprintpilot.api.dto.StoryResponse;
import com.sprintpilot.api.dto.StoryStatusUpdateRequest;
import com.sprintpilot.api.entity.*;
import com.sprintpilot.api.exception.ResourceNotFoundException;
import com.sprintpilot.api.repository.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class UserStoryService {

    @Autowired
    private UserStoryRepository userStoryRepository;

    @Autowired
    private ProductRepository productRepository;

    @Autowired
    private RequirementRepository requirementRepository;

    @Autowired
    private SprintRepository sprintRepository;

    @Autowired
    private ReleaseRepository releaseRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private AuthService authService;

    @Transactional(readOnly = true)
    public List<StoryResponse> getBacklogByProduct(Long productId) {
        return userStoryRepository.findByProductIdOrderByPriorityScoreDesc(productId).stream()
                .map(StoryResponse::fromEntity)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public List<StoryResponse> getStoriesBySprint(Long sprintId) {
        return userStoryRepository.findBySprintId(sprintId).stream()
                .map(StoryResponse::fromEntity)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public StoryResponse getStoryById(Long id) {
        UserStory story = userStoryRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("User story not found with id: " + id));
        return StoryResponse.fromEntity(story);
    }

    @Transactional
    public StoryResponse createStory(StoryRequest req) {
        Product product = productRepository.findById(req.getProductId())
                .orElseThrow(() -> new ResourceNotFoundException("Product not found with id: " + req.getProductId()));

        User currentUser = authService.getCurrentUser();

        UserStory story = new UserStory();
        story.setProduct(product);
        story.setTitle(req.getTitle());
        story.setAsA(req.getAsA());
        story.setIWant(req.getIWant());
        story.setSoThat(req.getSoThat());
        story.setAcceptanceCriteria(req.getAcceptanceCriteria());
        story.setPriority(req.getPriority());
        story.setStoryPoints(req.getStoryPoints());
        story.setStatus(req.getStatus() != null ? req.getStatus() : StoryStatus.BACKLOG);
        story.setReporter(currentUser);

        if (req.getAssigneeId() != null) {
            userRepository.findById(req.getAssigneeId()).ifPresent(story::setAssignee);
        }
        if (req.getRequirementId() != null) {
            requirementRepository.findById(req.getRequirementId()).ifPresent(story::setRequirement);
        }
        if (req.getSprintId() != null) {
            sprintRepository.findById(req.getSprintId()).ifPresent(story::setSprint);
        }
        if (req.getReleaseId() != null) {
            releaseRepository.findById(req.getReleaseId()).ifPresent(story::setRelease);
        }

        story.setBusinessValue(req.getBusinessValue());
        story.setCustomerImpact(req.getCustomerImpact());
        story.setUrgency(req.getUrgency());
        story.setComplexity(req.getComplexity());
        story.calculatePriorityScore();
        story.setLabels(req.getLabels());
        story.setDueDate(req.getDueDate());

        story = userStoryRepository.save(story);

        // Update sprint points if assigned to a sprint
        if (story.getSprint() != null) {
            updateSprintPoints(story.getSprint().getId());
        }

        return StoryResponse.fromEntity(story);
    }

    @Transactional
    public StoryResponse updateStory(Long id, StoryRequest req) {
        UserStory story = userStoryRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("User story not found with id: " + id));

        story.setTitle(req.getTitle());
        story.setAsA(req.getAsA());
        story.setIWant(req.getIWant());
        story.setSoThat(req.getSoThat());
        story.setAcceptanceCriteria(req.getAcceptanceCriteria());
        story.setPriority(req.getPriority());
        story.setStoryPoints(req.getStoryPoints());
        story.setLabels(req.getLabels());
        story.setDueDate(req.getDueDate());

        if (req.getAssigneeId() != null) {
            userRepository.findById(req.getAssigneeId()).ifPresent(story::setAssignee);
        } else {
            story.setAssignee(null);
        }

        if (req.getRequirementId() != null) {
            requirementRepository.findById(req.getRequirementId()).ifPresent(story::setRequirement);
        } else {
            story.setRequirement(null);
        }

        Long oldSprintId = story.getSprint() != null ? story.getSprint().getId() : null;
        if (req.getSprintId() != null) {
            Sprint sprint = sprintRepository.findById(req.getSprintId())
                    .orElseThrow(() -> new ResourceNotFoundException("Sprint not found with id: " + req.getSprintId()));
            story.setSprint(sprint);
        } else {
            story.setSprint(null);
        }

        if (req.getReleaseId() != null) {
            Release release = releaseRepository.findById(req.getReleaseId())
                    .orElseThrow(() -> new ResourceNotFoundException("Release not found with id: " + req.getReleaseId()));
            story.setRelease(release);
        } else {
            story.setRelease(null);
        }

        story.setBusinessValue(req.getBusinessValue());
        story.setCustomerImpact(req.getCustomerImpact());
        story.setUrgency(req.getUrgency());
        story.setComplexity(req.getComplexity());
        story.calculatePriorityScore();

        story = userStoryRepository.save(story);

        if (oldSprintId != null) updateSprintPoints(oldSprintId);
        if (story.getSprint() != null) updateSprintPoints(story.getSprint().getId());

        return StoryResponse.fromEntity(story);
    }

    @Transactional
    public StoryResponse updateStoryStatus(Long id, StoryStatusUpdateRequest req) {
        UserStory story = userStoryRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("User story not found with id: " + id));

        story.setStatus(req.getStatus());
        story = userStoryRepository.save(story);

        if (story.getSprint() != null) {
            updateSprintPoints(story.getSprint().getId());
        }

        return StoryResponse.fromEntity(story);
    }

    @Transactional
    public StoryResponse updateStoryPrioritization(Long id, StoryPrioritizationRequest req) {
        UserStory story = userStoryRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("User story not found with id: " + id));

        story.setBusinessValue(req.getBusinessValue());
        story.setCustomerImpact(req.getCustomerImpact());
        story.setUrgency(req.getUrgency());
        story.setComplexity(req.getComplexity());
        story.calculatePriorityScore();

        story = userStoryRepository.save(story);
        return StoryResponse.fromEntity(story);
    }

    @Transactional
    public StoryResponse assignToSprint(Long storyId, Long sprintId) {
        UserStory story = userStoryRepository.findById(storyId)
                .orElseThrow(() -> new ResourceNotFoundException("User story not found with id: " + storyId));

        Long oldSprintId = story.getSprint() != null ? story.getSprint().getId() : null;

        if (sprintId != null) {
            Sprint sprint = sprintRepository.findById(sprintId)
                    .orElseThrow(() -> new ResourceNotFoundException("Sprint not found with id: " + sprintId));
            story.setSprint(sprint);
            if (story.getStatus() == StoryStatus.BACKLOG) {
                story.setStatus(StoryStatus.TODO);
            }
        } else {
            story.setSprint(null);
            story.setStatus(StoryStatus.BACKLOG);
        }

        story = userStoryRepository.save(story);

        if (oldSprintId != null) updateSprintPoints(oldSprintId);
        if (sprintId != null) updateSprintPoints(sprintId);

        return StoryResponse.fromEntity(story);
    }

    @Transactional
    public void deleteStory(Long id) {
        UserStory story = userStoryRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("User story not found with id: " + id));
        Long sprintId = story.getSprint() != null ? story.getSprint().getId() : null;
        userStoryRepository.delete(story);
        if (sprintId != null) {
            updateSprintPoints(sprintId);
        }
    }

    private void updateSprintPoints(Long sprintId) {
        sprintRepository.findById(sprintId).ifPresent(sprint -> {
            Integer total = userStoryRepository.sumPointsBySprintId(sprintId);
            Integer completed = userStoryRepository.sumCompletedPointsBySprintId(sprintId);
            sprint.setTotalPoints(total != null ? total : 0);
            sprint.setCompletedPoints(completed != null ? completed : 0);
            sprintRepository.save(sprint);
        });
    }
}
