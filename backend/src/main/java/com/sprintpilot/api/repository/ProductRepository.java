package com.sprintpilot.api.repository;

import com.sprintpilot.api.entity.Product;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;
import java.util.Optional;

@Repository
public interface ProductRepository extends JpaRepository<Product, Long> {
    Optional<Product> findBySlug(String slug);
    Boolean existsBySlug(String slug);
    List<Product> findByOwnerId(Long ownerId);
    List<Product> findAllByOrderByCreatedAtDesc();
}
