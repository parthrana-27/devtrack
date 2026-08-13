package com.devtrack.controller;

import com.devtrack.dto.SprintMetricsResponse;
import com.devtrack.dto.SprintRequest;
import com.devtrack.dto.SprintResponse;
import com.devtrack.service.SprintService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/sprints")
@RequiredArgsConstructor
@Tag(name = "Sprint Management", description = "APIs for managing project sprints")
public class SprintController {

    private final SprintService sprintService;

    @PostMapping
    @Operation(summary = "Create a new sprint")
    public ResponseEntity<SprintResponse> createSprint(
            @Valid @RequestBody SprintRequest request,
            Authentication authentication) {
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(sprintService.createSprint(request, authentication.getName()));
    }

    @GetMapping("/project/{projectId}")
    @Operation(summary = "Get all sprints for a project")
    public ResponseEntity<List<SprintResponse>> getProjectSprints(
            @PathVariable Long projectId,
            Authentication authentication) {
        return ResponseEntity.ok(sprintService.getProjectSprints(projectId, authentication.getName()));
    }

    @PostMapping("/{sprintId}/start")
    @Operation(summary = "Start a sprint")
    public ResponseEntity<SprintResponse> startSprint(
            @PathVariable Long sprintId,
            Authentication authentication) {
        return ResponseEntity.ok(sprintService.startSprint(sprintId, authentication.getName()));
    }

    @PostMapping("/{sprintId}/complete")
    @Operation(summary = "Complete a sprint")
    public ResponseEntity<SprintResponse> completeSprint(
            @PathVariable Long sprintId,
            Authentication authentication) {
        return ResponseEntity.ok(sprintService.completeSprint(sprintId, authentication.getName()));
    }

    @PostMapping("/{sprintId}/issues/{issueId}")
    @Operation(summary = "Add an issue to a sprint")
    public ResponseEntity<Void> addIssueToSprint(
            @PathVariable Long sprintId,
            @PathVariable Long issueId,
            Authentication authentication) {
        sprintService.addIssueToSprint(sprintId, issueId, authentication.getName());
        return ResponseEntity.ok().build();
    }

    @DeleteMapping("/{sprintId}/issues/{issueId}")
    @Operation(summary = "Remove an issue from a sprint")
    public ResponseEntity<Void> removeIssueFromSprint(
            @PathVariable Long sprintId,
            @PathVariable Long issueId,
            Authentication authentication) {
        sprintService.removeIssueFromSprint(sprintId, issueId, authentication.getName());
        return ResponseEntity.ok().build();
    }

    @GetMapping("/{sprintId}/metrics")
    @Operation(summary = "Get metrics for a sprint")
    public ResponseEntity<SprintMetricsResponse> getSprintMetrics(
            @PathVariable Long sprintId,
            Authentication authentication) {
        return ResponseEntity.ok(sprintService.getSprintMetrics(sprintId, authentication.getName()));
    }
}
