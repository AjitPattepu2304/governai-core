package com.governai.aisystem;

import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface AIApplicationRepository extends JpaRepository<AIApplication, Long> {
    List<AIApplication> findAllByOrganizationId(Long organizationId);
    Optional<AIApplication> findByIdAndOrganizationId(Long id, Long organizationId);
}
