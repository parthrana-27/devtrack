package com.devtrack.repository;

import com.devtrack.entity.Issue;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface IssueRepository extends JpaRepository<Issue, Long> {
    Optional<Issue> findByIssueKey(String issueKey);
    Page<Issue> findByProjectId(Long projectId, Pageable pageable);
    long countByProjectId(Long projectId);
}
