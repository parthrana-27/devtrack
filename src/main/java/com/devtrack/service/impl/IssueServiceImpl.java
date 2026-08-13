package com.devtrack.service.impl;

import com.devtrack.dto.IssueRequest;
import com.devtrack.dto.IssueResponse;
import com.devtrack.dto.IssueUpdateRequest;
import com.devtrack.entity.Issue;
import com.devtrack.entity.IssueStatus;
import com.devtrack.entity.Project;
import com.devtrack.entity.User;
import com.devtrack.exception.BadRequestException;
import com.devtrack.exception.ResourceNotFoundException;
import com.devtrack.exception.UnauthorizedException;
import com.devtrack.repository.IssueRepository;
import com.devtrack.repository.ProjectRepository;
import com.devtrack.repository.UserRepository;
import com.devtrack.security.OrganizationSecurity;
import com.devtrack.service.IssueService;
import com.devtrack.service.WorkflowValidator;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class IssueServiceImpl implements IssueService {

    private final IssueRepository issueRepository;
    private final ProjectRepository projectRepository;
    private final UserRepository userRepository;
    private final OrganizationSecurity organizationSecurity;
    private final WorkflowValidator workflowValidator;

    @Override
    @Transactional
    public IssueResponse createIssue(IssueRequest request, String currentUserEmail) {
        Project project = projectRepository.findById(request.getProjectId())
                .orElseThrow(() -> new ResourceNotFoundException("Project not found"));
        User currentUser = getUserByEmail(currentUserEmail);

        if (!organizationSecurity.isMember(project.getOrganization().getId(), currentUserEmail)) {
            throw new UnauthorizedException("You must be a member of the organization to create an issue");
        }

        User assignee = null;
        if (request.getAssigneeId() != null) {
            assignee = userRepository.findById(request.getAssigneeId())
                    .orElseThrow(() -> new ResourceNotFoundException("Assignee not found"));
            if (!organizationSecurity.isMember(project.getOrganization().getId(), assignee.getEmail())) {
                throw new BadRequestException("Assignee must be a member of the organization");
            }
        }

        long issueCount = issueRepository.countByProjectId(project.getId());
        String issueKey = project.getKey() + "-" + (issueCount + 1);

        Issue issue = Issue.builder()
                .issueKey(issueKey)
                .title(request.getTitle())
                .description(request.getDescription())
                .project(project)
                .creator(currentUser)
                .assignee(assignee)
                .priority(request.getPriority())
                .status(IssueStatus.TODO)
                .type(request.getType())
                .storyPoints(request.getStoryPoints())
                .dueDate(request.getDueDate())
                .build();

        issue = issueRepository.save(issue);
        return mapToResponse(issue);
    }

    @Override
    @Transactional(readOnly = true)
    public IssueResponse getIssue(Long id, String currentUserEmail) {
        Issue issue = issueRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Issue not found"));
        checkReadAccess(issue, currentUserEmail);
        return mapToResponse(issue);
    }

    @Override
    @Transactional(readOnly = true)
    public IssueResponse getIssueByKey(String issueKey, String currentUserEmail) {
        Issue issue = issueRepository.findByIssueKey(issueKey)
                .orElseThrow(() -> new ResourceNotFoundException("Issue not found with key: " + issueKey));
        checkReadAccess(issue, currentUserEmail);
        return mapToResponse(issue);
    }

    @Override
    @Transactional(readOnly = true)
    public Page<IssueResponse> getProjectIssues(Long projectId, Pageable pageable, String currentUserEmail) {
        Project project = projectRepository.findById(projectId)
                .orElseThrow(() -> new ResourceNotFoundException("Project not found"));
        
        if (!organizationSecurity.isMember(project.getOrganization().getId(), currentUserEmail)) {
            throw new UnauthorizedException("You do not have access to this project");
        }

        return issueRepository.findByProjectId(projectId, pageable)
                .map(this::mapToResponse);
    }

    @Override
    @Transactional
    public IssueResponse updateIssue(Long id, IssueUpdateRequest request, String currentUserEmail) {
        Issue issue = issueRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Issue not found"));
        User currentUser = getUserByEmail(currentUserEmail);

        boolean isCreator = issue.getCreator().getId().equals(currentUser.getId());
        boolean isAssignee = issue.getAssignee() != null && issue.getAssignee().getId().equals(currentUser.getId());
        boolean isOrgAdminOrOwner = organizationSecurity.hasRole(issue.getProject().getOrganization().getId(), currentUserEmail, "ADMIN")
                                 || organizationSecurity.hasRole(issue.getProject().getOrganization().getId(), currentUserEmail, "OWNER");
        boolean isProjectManager = issue.getProject().getProjectManager() != null && issue.getProject().getProjectManager().getId().equals(currentUser.getId());

        if (!isCreator && !isAssignee && !isOrgAdminOrOwner && !isProjectManager) {
            throw new UnauthorizedException("You do not have permission to update this issue");
        }

        if (request.getTitle() != null) issue.setTitle(request.getTitle());
        if (request.getDescription() != null) issue.setDescription(request.getDescription());
        if (request.getType() != null) issue.setType(request.getType());
        if (request.getPriority() != null) issue.setPriority(request.getPriority());
        if (request.getStoryPoints() != null) issue.setStoryPoints(request.getStoryPoints());
        if (request.getDueDate() != null) issue.setDueDate(request.getDueDate());

        if (request.getStatus() != null) {
            workflowValidator.validateTransition(issue.getStatus(), request.getStatus());
            issue.setStatus(request.getStatus());
        }

        if (request.getAssigneeId() != null) {
            User newAssignee = userRepository.findById(request.getAssigneeId())
                    .orElseThrow(() -> new ResourceNotFoundException("Assignee not found"));
            if (!organizationSecurity.isMember(issue.getProject().getOrganization().getId(), newAssignee.getEmail())) {
                throw new BadRequestException("Assignee must be a member of the organization");
            }
            issue.setAssignee(newAssignee);
        }

        issue = issueRepository.save(issue);
        return mapToResponse(issue);
    }

    @Override
    @Transactional
    public void deleteIssue(Long id, String currentUserEmail) {
        Issue issue = issueRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Issue not found"));
        
        boolean isOrgAdminOrOwner = organizationSecurity.hasRole(issue.getProject().getOrganization().getId(), currentUserEmail, "ADMIN")
                                 || organizationSecurity.hasRole(issue.getProject().getOrganization().getId(), currentUserEmail, "OWNER");
        boolean isProjectManager = issue.getProject().getProjectManager() != null && issue.getProject().getProjectManager().getId().equals(getUserByEmail(currentUserEmail).getId());

        if (!isOrgAdminOrOwner && !isProjectManager) {
            throw new UnauthorizedException("Only organization admins or the project manager can delete issues");
        }

        issueRepository.delete(issue);
    }

    private User getUserByEmail(String email) {
        return userRepository.findByEmail(email)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));
    }

    private void checkReadAccess(Issue issue, String email) {
        if (!organizationSecurity.isMember(issue.getProject().getOrganization().getId(), email)) {
            throw new UnauthorizedException("You do not have access to this issue");
        }
    }

    private IssueResponse mapToResponse(Issue issue) {
        return IssueResponse.builder()
                .id(issue.getId())
                .issueKey(issue.getIssueKey())
                .title(issue.getTitle())
                .description(issue.getDescription())
                .projectId(issue.getProject().getId())
                .projectName(issue.getProject().getName())
                .projectKey(issue.getProject().getKey())
                .creatorId(issue.getCreator().getId())
                .creatorName(issue.getCreator().getName())
                .assigneeId(issue.getAssignee() != null ? issue.getAssignee().getId() : null)
                .assigneeName(issue.getAssignee() != null ? issue.getAssignee().getName() : null)
                .priority(issue.getPriority())
                .status(issue.getStatus())
                .type(issue.getType())
                .storyPoints(issue.getStoryPoints())
                .dueDate(issue.getDueDate())
                .createdAt(issue.getCreatedAt())
                .updatedAt(issue.getUpdatedAt())
                .build();
    }
}
