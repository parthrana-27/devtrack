package com.devtrack.service;

import com.devtrack.dto.ProjectAnalyticsResponse;
import com.devtrack.entity.IssueStatus;
import com.devtrack.entity.Project;
import com.devtrack.exception.ResourceNotFoundException;
import com.devtrack.exception.UnauthorizedException;
import com.devtrack.repository.IssueRepository;
import com.devtrack.repository.ProjectRepository;
import com.devtrack.security.OrganizationSecurity;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.util.concurrent.CompletableFuture;
import java.util.concurrent.ExecutionException;

@Service
@RequiredArgsConstructor
@Slf4j
public class AnalyticsService {

    private final IssueRepository issueRepository;
    private final ProjectRepository projectRepository;
    private final OrganizationSecurity organizationSecurity;

    public ProjectAnalyticsResponse getProjectAnalytics(Long projectId, String currentUserEmail) {
        Project project = projectRepository.findById(projectId)
                .orElseThrow(() -> new ResourceNotFoundException("Project not found"));

        if (!organizationSecurity.isMember(project.getOrganization().getId(), currentUserEmail)) {
            throw new UnauthorizedException("You do not have access to this project");
        }

        CompletableFuture<Long> totalIssuesFuture = CompletableFuture.supplyAsync(() ->
                issueRepository.countByProjectId(projectId)
        );

        CompletableFuture<Long> completedIssuesFuture = CompletableFuture.supplyAsync(() ->
                issueRepository.countByProjectIdAndStatus(projectId, IssueStatus.DONE)
        );

        CompletableFuture<Long> inProgressIssuesFuture = CompletableFuture.supplyAsync(() ->
                issueRepository.countByProjectIdAndStatus(projectId, IssueStatus.IN_PROGRESS)
        );

        CompletableFuture.allOf(totalIssuesFuture, completedIssuesFuture, inProgressIssuesFuture).join();

        try {
            return ProjectAnalyticsResponse.builder()
                    .projectId(projectId)
                    .totalIssues(totalIssuesFuture.get())
                    .completedIssues(completedIssuesFuture.get())
                    .inProgressIssues(inProgressIssuesFuture.get())
                    .overdueIssues(0) // Overdue issues can be calculated similarly if needed
                    .build();
        } catch (InterruptedException | ExecutionException e) {
            log.error("Error calculating project analytics for project {}", projectId, e);
            throw new RuntimeException("Failed to calculate analytics", e);
        }
    }
}
