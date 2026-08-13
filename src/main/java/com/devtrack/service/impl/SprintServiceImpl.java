package com.devtrack.service.impl;

import com.devtrack.dto.SprintMetricsResponse;
import com.devtrack.dto.SprintRequest;
import com.devtrack.dto.SprintResponse;
import com.devtrack.entity.Issue;
import com.devtrack.entity.IssueStatus;
import com.devtrack.entity.Project;
import com.devtrack.entity.Sprint;
import com.devtrack.entity.SprintStatus;
import com.devtrack.exception.BadRequestException;
import com.devtrack.exception.ResourceNotFoundException;
import com.devtrack.exception.UnauthorizedException;
import com.devtrack.repository.IssueRepository;
import com.devtrack.repository.ProjectRepository;
import com.devtrack.repository.SprintRepository;
import com.devtrack.security.OrganizationSecurity;
import com.devtrack.service.SprintService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class SprintServiceImpl implements SprintService {

    private final SprintRepository sprintRepository;
    private final ProjectRepository projectRepository;
    private final IssueRepository issueRepository;
    private final OrganizationSecurity organizationSecurity;

    @Override
    @Transactional
    public SprintResponse createSprint(SprintRequest request, String currentUserEmail) {
        Project project = projectRepository.findById(request.getProjectId())
                .orElseThrow(() -> new ResourceNotFoundException("Project not found"));
        
        checkProjectAccess(project, currentUserEmail);

        if (request.getStartDate().isAfter(request.getEndDate())) {
            throw new BadRequestException("Start date must be before end date");
        }

        Sprint sprint = Sprint.builder()
                .name(request.getName())
                .project(project)
                .startDate(request.getStartDate())
                .endDate(request.getEndDate())
                .status(SprintStatus.PLANNED)
                .build();

        sprint = sprintRepository.save(sprint);
        return mapToResponse(sprint);
    }

    @Override
    @Transactional(readOnly = true)
    public List<SprintResponse> getProjectSprints(Long projectId, String currentUserEmail) {
        Project project = projectRepository.findById(projectId)
                .orElseThrow(() -> new ResourceNotFoundException("Project not found"));
        
        checkProjectAccess(project, currentUserEmail);

        return sprintRepository.findByProjectId(projectId).stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    @Override
    @Transactional
    public SprintResponse startSprint(Long sprintId, String currentUserEmail) {
        Sprint sprint = sprintRepository.findById(sprintId)
                .orElseThrow(() -> new ResourceNotFoundException("Sprint not found"));
        
        checkProjectAccess(sprint.getProject(), currentUserEmail);

        if (sprint.getStatus() != SprintStatus.PLANNED) {
            throw new BadRequestException("Only planned sprints can be started");
        }

        if (sprintRepository.existsByProjectIdAndStatus(sprint.getProject().getId(), SprintStatus.ACTIVE)) {
            throw new BadRequestException("An active sprint already exists for this project");
        }

        sprint.setStatus(SprintStatus.ACTIVE);
        sprint = sprintRepository.save(sprint);
        return mapToResponse(sprint);
    }

    @Override
    @Transactional
    public SprintResponse completeSprint(Long sprintId, String currentUserEmail) {
        Sprint sprint = sprintRepository.findById(sprintId)
                .orElseThrow(() -> new ResourceNotFoundException("Sprint not found"));
        
        checkProjectAccess(sprint.getProject(), currentUserEmail);

        if (sprint.getStatus() != SprintStatus.ACTIVE) {
            throw new BadRequestException("Only active sprints can be completed");
        }

        // Move incomplete issues back to backlog
        for (Issue issue : sprint.getIssues()) {
            if (issue.getStatus() != IssueStatus.DONE && issue.getStatus() != IssueStatus.CLOSED) {
                issue.setSprint(null);
                issueRepository.save(issue);
            }
        }

        sprint.setStatus(SprintStatus.COMPLETED);
        sprint = sprintRepository.save(sprint);
        return mapToResponse(sprint);
    }

    @Override
    @Transactional
    public void addIssueToSprint(Long sprintId, Long issueId, String currentUserEmail) {
        Sprint sprint = sprintRepository.findById(sprintId)
                .orElseThrow(() -> new ResourceNotFoundException("Sprint not found"));
        Issue issue = issueRepository.findById(issueId)
                .orElseThrow(() -> new ResourceNotFoundException("Issue not found"));
        
        checkProjectAccess(sprint.getProject(), currentUserEmail);

        if (!issue.getProject().getId().equals(sprint.getProject().getId())) {
            throw new BadRequestException("Issue and sprint must belong to the same project");
        }

        issue.setSprint(sprint);
        issueRepository.save(issue);
    }

    @Override
    @Transactional
    public void removeIssueFromSprint(Long sprintId, Long issueId, String currentUserEmail) {
        Sprint sprint = sprintRepository.findById(sprintId)
                .orElseThrow(() -> new ResourceNotFoundException("Sprint not found"));
        Issue issue = issueRepository.findById(issueId)
                .orElseThrow(() -> new ResourceNotFoundException("Issue not found"));
        
        checkProjectAccess(sprint.getProject(), currentUserEmail);

        if (issue.getSprint() == null || !issue.getSprint().getId().equals(sprintId)) {
            throw new BadRequestException("Issue is not in this sprint");
        }

        issue.setSprint(null);
        issueRepository.save(issue);
    }

    @Override
    @Transactional(readOnly = true)
    public SprintMetricsResponse getSprintMetrics(Long sprintId, String currentUserEmail) {
        Sprint sprint = sprintRepository.findById(sprintId)
                .orElseThrow(() -> new ResourceNotFoundException("Sprint not found"));
        
        checkProjectAccess(sprint.getProject(), currentUserEmail);

        int totalPoints = 0;
        int completedPoints = 0;

        for (Issue issue : sprint.getIssues()) {
            int points = issue.getStoryPoints() != null ? issue.getStoryPoints() : 0;
            totalPoints += points;
            
            if (issue.getStatus() == IssueStatus.DONE || issue.getStatus() == IssueStatus.CLOSED) {
                completedPoints += points;
            }
        }

        int remainingPoints = totalPoints - completedPoints;
        double percentage = totalPoints == 0 ? 0.0 : ((double) completedPoints / totalPoints) * 100.0;

        return SprintMetricsResponse.builder()
                .sprintId(sprint.getId())
                .sprintName(sprint.getName())
                .totalStoryPoints(totalPoints)
                .completedStoryPoints(completedPoints)
                .remainingStoryPoints(remainingPoints)
                .completionPercentage(percentage)
                .build();
    }

    private void checkProjectAccess(Project project, String email) {
        if (!organizationSecurity.isMember(project.getOrganization().getId(), email)) {
            throw new UnauthorizedException("You must be a member of the organization to manage sprints");
        }
    }

    private SprintResponse mapToResponse(Sprint sprint) {
        return SprintResponse.builder()
                .id(sprint.getId())
                .name(sprint.getName())
                .projectId(sprint.getProject().getId())
                .startDate(sprint.getStartDate())
                .endDate(sprint.getEndDate())
                .status(sprint.getStatus())
                .build();
    }
}
