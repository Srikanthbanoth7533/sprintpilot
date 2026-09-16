package com.sprintpilot.api.service;

import com.sprintpilot.api.dto.SprintRequest;
import com.sprintpilot.api.dto.SprintResponse;
import com.sprintpilot.api.entity.Product;
import com.sprintpilot.api.entity.Sprint;
import com.sprintpilot.api.entity.SprintStatus;
import com.sprintpilot.api.entity.StoryStatus;
import com.sprintpilot.api.entity.UserStory;
import com.sprintpilot.api.exception.BadRequestException;
import com.sprintpilot.api.exception.ResourceNotFoundException;
import com.sprintpilot.api.repository.ProductRepository;
import com.sprintpilot.api.repository.SprintRepository;
import com.sprintpilot.api.repository.UserStoryRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class SprintService {

    @Autowired
    private SprintRepository sprintRepository;

    @Autowired
    private ProductRepository productRepository;

    @Autowired
    private UserStoryRepository userStoryRepository;

    @Transactional(readOnly = true)
    public List<SprintResponse> getSprintsByProduct(Long productId) {
        return sprintRepository.findByProductIdOrderByCreatedAtDesc(productId).stream()
                .map(this::enrichSprint)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public SprintResponse getSprintById(Long id) {
        Sprint sprint = sprintRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Sprint not found with id: " + id));
        return enrichSprint(sprint);
    }

    @Transactional(readOnly = true)
    public SprintResponse getActiveSprint(Long productId) {
        return sprintRepository.findFirstByProductIdAndStatusOrderByStartDateDesc(productId, SprintStatus.ACTIVE)
                .map(this::enrichSprint)
                .orElse(null);
    }

    @Transactional
    public SprintResponse createSprint(SprintRequest req) {
        Product product = productRepository.findById(req.getProductId())
                .orElseThrow(() -> new ResourceNotFoundException("Product not found with id: " + req.getProductId()));

        Sprint sprint = new Sprint(
                product,
                req.getName(),
                req.getGoal(),
                req.getStartDate(),
                req.getEndDate(),
                req.getStatus() != null ? req.getStatus() : SprintStatus.PLANNING
        );

        sprint = sprintRepository.save(sprint);
        return enrichSprint(sprint);
    }

    @Transactional
    public SprintResponse startSprint(Long id) {
        Sprint sprint = sprintRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Sprint not found with id: " + id));

        // Check if there is already an active sprint for this product
        List<Sprint> activeSprints = sprintRepository.findByProductIdAndStatus(sprint.getProduct().getId(), SprintStatus.ACTIVE);
        if (!activeSprints.isEmpty() && !activeSprints.get(0).getId().equals(id)) {
            throw new BadRequestException("Another sprint is currently ACTIVE for this product: " + activeSprints.get(0).getName());
        }

        sprint.setStatus(SprintStatus.ACTIVE);
        sprint = sprintRepository.save(sprint);
        return enrichSprint(sprint);
    }

    @Transactional
    public SprintResponse completeSprint(Long id) {
        Sprint sprint = sprintRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Sprint not found with id: " + id));

        sprint.setStatus(SprintStatus.COMPLETED);

        // Recalculate completed points
        Integer completed = userStoryRepository.sumCompletedPointsBySprintId(id);
        sprint.setCompletedPoints(completed != null ? completed : 0);

        sprint = sprintRepository.save(sprint);
        return enrichSprint(sprint);
    }

    @Transactional
    public void deleteSprint(Long id) {
        Sprint sprint = sprintRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Sprint not found with id: " + id));

        // Unlink stories
        List<UserStory> stories = userStoryRepository.findBySprintId(id);
        for (UserStory story : stories) {
            story.setSprint(null);
            story.setStatus(StoryStatus.BACKLOG);
            userStoryRepository.save(story);
        }

        sprintRepository.delete(sprint);
    }

    private SprintResponse enrichSprint(Sprint sprint) {
        SprintResponse res = SprintResponse.fromEntity(sprint);
        List<UserStory> stories = userStoryRepository.findBySprintId(sprint.getId());
        long completed = stories.stream().filter(s -> s.getStatus() == StoryStatus.DONE).count();
        res.setTotalStories((long) stories.size());
        res.setCompletedStories(completed);
        return res;
    }
}
