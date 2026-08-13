package com.devtrack.service;

import com.devtrack.dto.ProjectRequest;
import com.devtrack.dto.ProjectResponse;
import com.devtrack.dto.ProjectUpdateRequest;

import java.util.List;

public interface ProjectService {
    ProjectResponse createProject(ProjectRequest request, String currentUserEmail);
    ProjectResponse getProject(Long id, String currentUserEmail);
    ProjectResponse getProjectByKey(String key, String currentUserEmail);
    List<ProjectResponse> getOrganizationProjects(Long organizationId, String currentUserEmail);
    ProjectResponse updateProject(Long id, ProjectUpdateRequest request, String currentUserEmail);
    void deleteProject(Long id, String currentUserEmail);
}
