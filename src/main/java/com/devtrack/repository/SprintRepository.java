package com.devtrack.repository;

import com.devtrack.entity.Sprint;
import com.devtrack.entity.SprintStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface SprintRepository extends JpaRepository<Sprint, Long> {
    List<Sprint> findByProjectId(Long projectId);
    boolean existsByProjectIdAndStatus(Long projectId, SprintStatus status);
}
