package com.devtrack.controller;

import com.devtrack.dto.IssueRequest;
import com.devtrack.dto.IssueResponse;
import com.devtrack.dto.IssueUpdateRequest;
import com.devtrack.service.IssueService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/issues")
@RequiredArgsConstructor
@Tag(name = "Issue Management", description = "APIs for managing issues within projects")
public class IssueController {

    private final IssueService issueService;

    @PostMapping
    @Operation(summary = "Create a new issue")
    public ResponseEntity<IssueResponse> createIssue(
            @Valid @RequestBody IssueRequest request,
            Authentication authentication) {
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(issueService.createIssue(request, authentication.getName()));
    }

    @GetMapping("/{id}")
    @Operation(summary = "Get an issue by ID")
    public ResponseEntity<IssueResponse> getIssue(
            @PathVariable Long id,
            Authentication authentication) {
        return ResponseEntity.ok(issueService.getIssue(id, authentication.getName()));
    }

    @GetMapping("/key/{issueKey}")
    @Operation(summary = "Get an issue by its key")
    public ResponseEntity<IssueResponse> getIssueByKey(
            @PathVariable String issueKey,
            Authentication authentication) {
        return ResponseEntity.ok(issueService.getIssueByKey(issueKey, authentication.getName()));
    }

    @GetMapping("/project/{projectId}")
    @Operation(summary = "Get all issues for a project (paginated)")
    public ResponseEntity<Page<IssueResponse>> getProjectIssues(
            @PathVariable Long projectId,
            Pageable pageable,
            Authentication authentication) {
        return ResponseEntity.ok(issueService.getProjectIssues(projectId, pageable, authentication.getName()));
    }

    @PutMapping("/{id}")
    @Operation(summary = "Update an issue")
    public ResponseEntity<IssueResponse> updateIssue(
            @PathVariable Long id,
            @Valid @RequestBody IssueUpdateRequest request,
            Authentication authentication) {
        return ResponseEntity.ok(issueService.updateIssue(id, request, authentication.getName()));
    }

    @DeleteMapping("/{id}")
    @Operation(summary = "Delete an issue")
    public ResponseEntity<Void> deleteIssue(
            @PathVariable Long id,
            Authentication authentication) {
        issueService.deleteIssue(id, authentication.getName());
        return ResponseEntity.noContent().build();
    }
}
