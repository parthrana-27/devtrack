package com.devtrack.service;

import com.devtrack.dto.SprintMetricsResponse;
import com.devtrack.dto.SprintRequest;
import com.devtrack.dto.SprintResponse;

import java.util.List;

public interface SprintService {
    SprintResponse createSprint(SprintRequest request, String currentUserEmail);
    List<SprintResponse> getProjectSprints(Long projectId, String currentUserEmail);
    SprintResponse startSprint(Long sprintId, String currentUserEmail);
    SprintResponse completeSprint(Long sprintId, String currentUserEmail);
    void addIssueToSprint(Long sprintId, Long issueId, String currentUserEmail);
    void removeIssueFromSprint(Long sprintId, Long issueId, String currentUserEmail);
    SprintMetricsResponse getSprintMetrics(Long sprintId, String currentUserEmail);
}
