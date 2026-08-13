package com.devtrack.repository;

import com.devtrack.entity.Project;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface ProjectRepository extends JpaRepository<Project, Long> {
    List<Project> findByOrganizationId(Long organizationId);
    Optional<Project> findByKey(String key);
    boolean existsByKeyAndOrganizationId(String key, Long organizationId);
}
