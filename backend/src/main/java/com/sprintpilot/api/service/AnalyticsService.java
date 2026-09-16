package com.sprintpilot.api.service;

import com.sprintpilot.api.dto.DashboardMetricsResponse;
import com.sprintpilot.api.dto.SprintResponse;
import com.sprintpilot.api.entity.ProductStatus;
import com.sprintpilot.api.entity.ReleaseStatus;
import com.sprintpilot.api.entity.Sprint;
import com.sprintpilot.api.entity.SprintStatus;
import com.sprintpilot.api.entity.StoryStatus;
import com.sprintpilot.api.repository.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.*;

@Service
public class AnalyticsService {

    @Autowired
    private ProductRepository productRepository;

    @Autowired
    private SprintRepository sprintRepository;

    @Autowired
    private UserStoryRepository userStoryRepository;

    @Autowired
    private BlockerRepository blockerRepository;

    @Autowired
    private ReleaseRepository releaseRepository;

    @Autowired
    private SprintService sprintService;

    @Transactional(readOnly = true)
    public DashboardMetricsResponse getDashboardMetrics(Long productId) {
        DashboardMetricsResponse res = new DashboardMetricsResponse();

        long activeProducts = productRepository.findAll().stream()
                .filter(p -> p.getStatus() == ProductStatus.ACTIVE)
                .count();
        res.setActiveProductsCount(activeProducts);

        // Find active sprint
        Sprint activeSprint = null;
        if (productId != null) {
            activeSprint = sprintRepository.findFirstByProductIdAndStatusOrderByStartDateDesc(productId, SprintStatus.ACTIVE).orElse(null);
        } else {
            List<Sprint> allActive = sprintRepository.findAll().stream()
                    .filter(s -> s.getStatus() == SprintStatus.ACTIVE)
                    .toList();
            if (!allActive.isEmpty()) {
                activeSprint = allActive.get(0);
            }
        }

        if (activeSprint != null) {
            SprintResponse sprintRes = sprintService.getSprintById(activeSprint.getId());
            res.setActiveSprint(sprintRes);
            res.setSprintCompletionRate(sprintRes.getCompletionPercentage());
        } else {
            res.setSprintCompletionRate(0.0);
        }

        // Story counts
        long backlogCount = 0;
        long inProgressCount = 0;
        long completedCount = 0;
        long blockedCount = 0;

        Map<String, Long> statusDist = new LinkedHashMap<>();
        Map<String, Long> priorityDist = new LinkedHashMap<>();

        for (StoryStatus status : StoryStatus.values()) {
            statusDist.put(status.name(), 0L);
        }

        List<com.sprintpilot.api.entity.UserStory> stories = (productId != null)
                ? userStoryRepository.findByProductIdOrderByPriorityScoreDesc(productId)
                : userStoryRepository.findAll();

        for (var story : stories) {
            statusDist.put(story.getStatus().name(), statusDist.getOrDefault(story.getStatus().name(), 0L) + 1);
            priorityDist.put(story.getPriority().name(), priorityDist.getOrDefault(story.getPriority().name(), 0L) + 1);

            if (story.getStatus() == StoryStatus.BACKLOG) backlogCount++;
            else if (story.getStatus() == StoryStatus.IN_PROGRESS || story.getStatus() == StoryStatus.IN_REVIEW) inProgressCount++;
            else if (story.getStatus() == StoryStatus.DONE) completedCount++;
            else if (story.getStatus() == StoryStatus.BLOCKED) blockedCount++;
        }

        res.setTotalBacklogStories(backlogCount);
        res.setInProgressStories(inProgressCount);
        res.setCompletedStories(completedCount);
        res.setBlockedStories(blockedCount);
        res.setStatusDistribution(statusDist);
        res.setPriorityDistribution(priorityDist);

        // Blockers
        res.setActiveBlockersCount(blockerRepository.countByResolvedFalse());

        // Releases
        long activeReleases = releaseRepository.findAll().stream()
                .filter(r -> r.getStatus() == ReleaseStatus.PLANNED || r.getStatus() == ReleaseStatus.ACTIVE)
                .count();
        res.setActiveReleasesCount(activeReleases);

        // Velocity & Trend across completed sprints
        List<Sprint> completedSprints = sprintRepository.findAll().stream()
                .filter(s -> s.getStatus() == SprintStatus.COMPLETED)
                .toList();

        List<Map<String, Object>> velocityTrend = new ArrayList<>();
        int totalCompletedPoints = 0;
        for (Sprint s : completedSprints) {
            Map<String, Object> map = new HashMap<>();
            map.put("sprintName", s.getName());
            map.put("plannedPoints", s.getTotalPoints() != null ? s.getTotalPoints() : 0);
            map.put("completedPoints", s.getCompletedPoints() != null ? s.getCompletedPoints() : 0);
            velocityTrend.add(map);
            totalCompletedPoints += (s.getCompletedPoints() != null ? s.getCompletedPoints() : 0);
        }

        double velocity = completedSprints.isEmpty() ? 18.0 : Math.round(((double) totalCompletedPoints / completedSprints.size()) * 10.0) / 10.0;
        res.setTeamVelocity(velocity);
        res.setVelocityTrend(velocityTrend);

        return res;
    }
}
