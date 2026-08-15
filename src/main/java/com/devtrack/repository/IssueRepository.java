package com.devtrack.repository;

import com.devtrack.entity.Issue;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.stereotype.Repository;

import com.devtrack.entity.IssueStatus;
import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

@Repository
public interface IssueRepository extends JpaRepository<Issue, Long>, JpaSpecificationExecutor<Issue> {
    Optional<Issue> findByIssueKey(String issueKey);
    Page<Issue> findByProjectId(Long projectId, Pageable pageable);
    long countByProjectId(Long projectId);
    long countByProjectIdAndStatus(Long projectId, IssueStatus status);
    List<Issue> findByDueDateBeforeAndStatusNot(LocalDate date, IssueStatus status);
}
