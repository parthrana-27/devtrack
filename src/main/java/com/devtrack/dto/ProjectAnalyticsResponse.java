package com.devtrack.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class ProjectAnalyticsResponse {
    private Long projectId;
    private long totalIssues;
    private long completedIssues;
    private long overdueIssues;
    private long inProgressIssues;
}
