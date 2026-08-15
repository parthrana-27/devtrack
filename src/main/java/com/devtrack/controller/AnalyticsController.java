package com.devtrack.controller;

import com.devtrack.dto.ProjectAnalyticsResponse;
import com.devtrack.service.AnalyticsService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/projects/{projectId}/analytics")
@RequiredArgsConstructor
public class AnalyticsController {

    private final AnalyticsService analyticsService;

    @GetMapping
    public ResponseEntity<ProjectAnalyticsResponse> getProjectAnalytics(
            @PathVariable Long projectId,
            Authentication authentication
    ) {
        return ResponseEntity.ok(analyticsService.getProjectAnalytics(projectId, authentication.getName()));
    }
}
