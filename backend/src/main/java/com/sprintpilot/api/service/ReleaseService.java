package com.sprintpilot.api.service;

import com.sprintpilot.api.dto.ReleaseRequest;
import com.sprintpilot.api.dto.ReleaseResponse;
import com.sprintpilot.api.entity.Product;
import com.sprintpilot.api.entity.Release;
import com.sprintpilot.api.entity.StoryStatus;
import com.sprintpilot.api.entity.UserStory;
import com.sprintpilot.api.exception.ResourceNotFoundException;
import com.sprintpilot.api.repository.ProductRepository;
import com.sprintpilot.api.repository.ReleaseRepository;
import com.sprintpilot.api.repository.UserStoryRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class ReleaseService {

    @Autowired
    private ReleaseRepository releaseRepository;

    @Autowired
    private ProductRepository productRepository;

    @Autowired
    private UserStoryRepository userStoryRepository;

    @Transactional(readOnly = true)
    public List<ReleaseResponse> getReleasesByProduct(Long productId) {
        return releaseRepository.findByProductIdOrderByTargetDateAsc(productId).stream()
                .map(this::enrichRelease)
                .collect(Collectors.toList());
    }

    @Transactional
    public ReleaseResponse createRelease(ReleaseRequest req) {
        Product product = productRepository.findById(req.getProductId())
                .orElseThrow(() -> new ResourceNotFoundException("Product not found with id: " + req.getProductId()));

        Release release = new Release(
                product,
                req.getVersion(),
                req.getName(),
                req.getDescription(),
                req.getTargetDate(),
                req.getStatus()
        );

        release = releaseRepository.save(release);
        return enrichRelease(release);
    }

    @Transactional
    public ReleaseResponse updateRelease(Long id, ReleaseRequest req) {
        Release release = releaseRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Release not found with id: " + id));

        release.setVersion(req.getVersion());
        release.setName(req.getName());
        release.setDescription(req.getDescription());
        release.setTargetDate(req.getTargetDate());
        release.setStatus(req.getStatus());

        release = releaseRepository.save(release);
        return enrichRelease(release);
    }

    @Transactional
    public void deleteRelease(Long id) {
        Release release = releaseRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Release not found with id: " + id));
        releaseRepository.delete(release);
    }

    private ReleaseResponse enrichRelease(Release release) {
        ReleaseResponse res = ReleaseResponse.fromEntity(release);
        List<UserStory> stories = userStoryRepository.findByReleaseId(release.getId());
        long completed = stories.stream().filter(s -> s.getStatus() == StoryStatus.DONE).count();
        res.setStoryCount((long) stories.size());
        res.setCompletedStoryCount(completed);
        return res;
    }
}
