package com.devtrack.service.impl;

import com.devtrack.dto.ProjectRequest;
import com.devtrack.dto.ProjectResponse;
import com.devtrack.dto.ProjectUpdateRequest;
import com.devtrack.entity.Organization;
import com.devtrack.entity.Project;
import com.devtrack.entity.ProjectStatus;
import com.devtrack.entity.User;
import com.devtrack.exception.BadRequestException;
import com.devtrack.exception.ResourceNotFoundException;
import com.devtrack.exception.UnauthorizedException;
import com.devtrack.repository.OrganizationRepository;
import com.devtrack.repository.ProjectRepository;
import com.devtrack.repository.UserRepository;
import com.devtrack.security.OrganizationSecurity;
import com.devtrack.service.ProjectService;
import lombok.RequiredArgsConstructor;
import org.springframework.cache.annotation.CacheEvict;
import org.springframework.cache.annotation.CachePut;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class ProjectServiceImpl implements ProjectService {

    private final ProjectRepository projectRepository;
    private final OrganizationRepository organizationRepository;
    private final UserRepository userRepository;
    private final OrganizationSecurity organizationSecurity;

    @Override
    @Transactional
    public ProjectResponse createProject(ProjectRequest request, String currentUserEmail) {
        User currentUser = getUserByEmail(currentUserEmail);
        Organization organization = organizationRepository.findById(request.getOrganizationId())
                .orElseThrow(() -> new ResourceNotFoundException("Organization not found"));

        if (!organizationSecurity.hasRole(organization.getId(), currentUser.getEmail(), "ADMIN")) {
            throw new UnauthorizedException("Only organization admins or owners can create projects");
        }

        if (projectRepository.existsByKeyAndOrganizationId(request.getKey(), organization.getId())) {
            throw new BadRequestException("Project key already exists in this organization");
        }

        User projectManager = currentUser;
        if (request.getProjectManagerId() != null) {
            projectManager = userRepository.findById(request.getProjectManagerId())
                    .orElseThrow(() -> new ResourceNotFoundException("Project manager user not found"));
            
            if (!organizationSecurity.isMember(organization.getId(), projectManager.getEmail())) {
                throw new BadRequestException("Project manager must be a member of the organization");
            }
        }

        Project project = Project.builder()
                .name(request.getName())
                .key(request.getKey())
                .description(request.getDescription())
                .organization(organization)
                .projectManager(projectManager)
                .status(ProjectStatus.PLANNING)
                .build();

        project = projectRepository.save(project);
        return mapToResponse(project);
    }

    @Override
    @Transactional(readOnly = true)
    @Cacheable(value = "project", key = "#id + '-' + #currentUserEmail")
    public ProjectResponse getProject(Long id, String currentUserEmail) {
        Project project = projectRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Project not found"));
        
        if (!organizationSecurity.isMember(project.getOrganization().getId(), currentUserEmail)) {
            throw new UnauthorizedException("You are not a member of the organization that owns this project");
        }
        
        return mapToResponse(project);
    }

    @Override
    @Transactional(readOnly = true)
    @Cacheable(value = "projectByKey", key = "#key + '-' + #currentUserEmail")
    public ProjectResponse getProjectByKey(String key, String currentUserEmail) {
        Project project = projectRepository.findByKey(key)
                .orElseThrow(() -> new ResourceNotFoundException("Project not found with key: " + key));
                
        if (!organizationSecurity.isMember(project.getOrganization().getId(), currentUserEmail)) {
            throw new UnauthorizedException("You are not a member of the organization that owns this project");
        }
        
        return mapToResponse(project);
    }

    @Override
    @Transactional(readOnly = true)
    public List<ProjectResponse> getOrganizationProjects(Long organizationId, String currentUserEmail) {
        if (!organizationSecurity.isMember(organizationId, currentUserEmail)) {
             throw new UnauthorizedException("You are not a member of this organization");
        }
        return projectRepository.findByOrganizationId(organizationId).stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    @Override
    @Transactional
    @CachePut(value = "project", key = "#id + '-' + #currentUserEmail")
    @CacheEvict(value = "projectByKey", allEntries = true)
    public ProjectResponse updateProject(Long id, ProjectUpdateRequest request, String currentUserEmail) {
        Project project = projectRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Project not found"));
        User currentUser = getUserByEmail(currentUserEmail);

        boolean isOrgAdmin = organizationSecurity.hasRole(project.getOrganization().getId(), currentUser.getEmail(), "ADMIN");
        boolean isProjectManager = project.getProjectManager() != null && project.getProjectManager().getId().equals(currentUser.getId());

        if (!isOrgAdmin && !isProjectManager) {
            throw new UnauthorizedException("Only organization admins or the project manager can update this project");
        }

        if (request.getName() != null) project.setName(request.getName());
        if (request.getDescription() != null) project.setDescription(request.getDescription());
        if (request.getStatus() != null) project.setStatus(request.getStatus());

        if (request.getProjectManagerId() != null) {
            if (!isOrgAdmin) {
                throw new UnauthorizedException("Only organization admins can change the project manager");
            }
            User newManager = userRepository.findById(request.getProjectManagerId())
                    .orElseThrow(() -> new ResourceNotFoundException("Project manager user not found"));
                    
            if (!organizationSecurity.isMember(project.getOrganization().getId(), newManager.getEmail())) {
                throw new BadRequestException("New project manager must be a member of the organization");
            }
            project.setProjectManager(newManager);
        }

        project = projectRepository.save(project);
        return mapToResponse(project);
    }

    @Override
    @Transactional
    @CacheEvict(value = {"project", "projectByKey"}, allEntries = true)
    public void deleteProject(Long id, String currentUserEmail) {
        Project project = projectRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Project not found"));
                
        if (!organizationSecurity.hasRole(project.getOrganization().getId(), currentUserEmail, "ADMIN")) {
            throw new UnauthorizedException("Only organization admins can delete projects");
        }

        projectRepository.delete(project);
    }

    private User getUserByEmail(String email) {
        return userRepository.findByEmail(email)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));
    }

    private ProjectResponse mapToResponse(Project project) {
        return ProjectResponse.builder()
                .id(project.getId())
                .name(project.getName())
                .key(project.getKey())
                .description(project.getDescription())
                .organizationId(project.getOrganization().getId())
                .organizationName(project.getOrganization().getName())
                .projectManagerId(project.getProjectManager() != null ? project.getProjectManager().getId() : null)
                .projectManagerName(project.getProjectManager() != null ? project.getProjectManager().getName() : null)
                .status(project.getStatus())
                .createdAt(project.getCreatedAt())
                .updatedAt(project.getUpdatedAt())
                .build();
    }
}
