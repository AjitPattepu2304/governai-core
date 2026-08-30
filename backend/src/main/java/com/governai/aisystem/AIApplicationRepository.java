package com.governai.aisystem;

import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface AIApplicationRepository extends JpaRepository<AIApplication, Long> {
    @EntityGraph(attributePaths = "organization")
    List<AIApplication> findAllByOrganizationId(Long organizationId);

    @EntityGraph(attributePaths = "organization")
    Optional<AIApplication> findByIdAndOrganizationId(Long id, Long organizationId);
}
