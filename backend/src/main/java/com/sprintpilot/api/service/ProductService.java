package com.sprintpilot.api.service;

import com.sprintpilot.api.dto.ProductRequest;
import com.sprintpilot.api.dto.ProductResponse;
import com.sprintpilot.api.entity.Product;
import com.sprintpilot.api.entity.SprintStatus;
import com.sprintpilot.api.entity.User;
import com.sprintpilot.api.exception.BadRequestException;
import com.sprintpilot.api.exception.ResourceNotFoundException;
import com.sprintpilot.api.repository.ProductRepository;
import com.sprintpilot.api.repository.SprintRepository;
import com.sprintpilot.api.repository.UserStoryRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.text.Normalizer;
import java.util.List;
import java.util.Locale;
import java.util.regex.Pattern;
import java.util.stream.Collectors;

@Service
public class ProductService {

    @Autowired
    private ProductRepository productRepository;

    @Autowired
    private SprintRepository sprintRepository;

    @Autowired
    private UserStoryRepository userStoryRepository;

    @Autowired
    private AuthService authService;

    private static final Pattern NONLATIN = Pattern.compile("[^\\w-]");
    private static final Pattern WHITESPACE = Pattern.compile("[\\s]");

    private String toSlug(String input) {
        String nowhitespace = WHITESPACE.matcher(input).replaceAll("-");
        String normalized = Normalizer.normalize(nowhitespace, Normalizer.Form.NFD);
        String slug = NONLATIN.matcher(normalized).replaceAll("");
        return slug.toLowerCase(Locale.ENGLISH);
    }

    @Transactional(readOnly = true)
    public List<ProductResponse> getAllProducts() {
        return productRepository.findAllByOrderByCreatedAtDesc().stream()
                .map(this::enrichProductResponse)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public ProductResponse getProductById(Long id) {
        Product product = productRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Product not found with id: " + id));
        return enrichProductResponse(product);
    }

    @Transactional
    public ProductResponse createProduct(ProductRequest req) {
        User currentUser = authService.getCurrentUser();
        String baseSlug = toSlug(req.getName());
        String slug = baseSlug;
        int counter = 1;
        while (productRepository.existsBySlug(slug)) {
            slug = baseSlug + "-" + counter++;
        }

        Product product = new Product(
                req.getName(),
                slug,
                req.getDescription(),
                req.getStatus(),
                currentUser,
                req.getTargetReleaseDate()
        );

        product = productRepository.save(product);
        return enrichProductResponse(product);
    }

    @Transactional
    public ProductResponse updateProduct(Long id, ProductRequest req) {
        Product product = productRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Product not found with id: " + id));

        product.setName(req.getName());
        product.setDescription(req.getDescription());
        product.setStatus(req.getStatus());
        product.setTargetReleaseDate(req.getTargetReleaseDate());

        product = productRepository.save(product);
        return enrichProductResponse(product);
    }

    @Transactional
    public void deleteProduct(Long id) {
        Product product = productRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Product not found with id: " + id));
        productRepository.delete(product);
    }

    private ProductResponse enrichProductResponse(Product product) {
        ProductResponse res = ProductResponse.fromEntity(product);
        long activeSprints = sprintRepository.findByProductIdAndStatus(product.getId(), SprintStatus.ACTIVE).size();
        long totalStories = userStoryRepository.findByProductIdOrderByPriorityScoreDesc(product.getId()).size();
        res.setActiveSprintCount(activeSprints);
        res.setTotalStoriesCount(totalStories);
        return res;
    }
}
