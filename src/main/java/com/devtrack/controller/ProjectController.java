package com.devtrack.controller;

import com.devtrack.dto.ProjectRequest;
import com.devtrack.dto.ProjectResponse;
import com.devtrack.dto.ProjectUpdateRequest;
import com.devtrack.service.ProjectService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/projects")
@RequiredArgsConstructor
@Tag(name = "Project Management", description = "APIs for managing projects within organizations")
public class ProjectController {

    private final ProjectService projectService;

    @PostMapping
    @Operation(summary = "Create a new project")
    public ResponseEntity<ProjectResponse> createProject(
            @Valid @RequestBody ProjectRequest request,
            Authentication authentication) {
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(projectService.createProject(request, authentication.getName()));
    }

    @GetMapping("/{id}")
    @Operation(summary = "Get project by ID")
    public ResponseEntity<ProjectResponse> getProject(@PathVariable Long id, Authentication authentication) {
        return ResponseEntity.ok(projectService.getProject(id, authentication.getName()));
    }

    @GetMapping("/key/{key}")
    @Operation(summary = "Get project by Key")
    public ResponseEntity<ProjectResponse> getProjectByKey(@PathVariable String key, Authentication authentication) {
        return ResponseEntity.ok(projectService.getProjectByKey(key, authentication.getName()));
    }

    @GetMapping("/organization/{orgId}")
    @Operation(summary = "Get all projects for an organization")
    @PreAuthorize("@orgSecurity.isMember(#orgId, principal)")
    public ResponseEntity<List<ProjectResponse>> getOrganizationProjects(
            @PathVariable Long orgId,
            Authentication authentication) {
        return ResponseEntity.ok(projectService.getOrganizationProjects(orgId, authentication.getName()));
    }

    @PutMapping("/{id}")
    @Operation(summary = "Update a project")
    public ResponseEntity<ProjectResponse> updateProject(
            @PathVariable Long id,
            @Valid @RequestBody ProjectUpdateRequest request,
            Authentication authentication) {
        return ResponseEntity.ok(projectService.updateProject(id, request, authentication.getName()));
    }

    @DeleteMapping("/{id}")
    @Operation(summary = "Delete a project")
    public ResponseEntity<Void> deleteProject(
            @PathVariable Long id,
            Authentication authentication) {
        projectService.deleteProject(id, authentication.getName());
        return ResponseEntity.noContent().build();
    }
}
