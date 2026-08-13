package com.devtrack.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class SprintMetricsResponse {
    private Long sprintId;
    private String sprintName;
    private int totalStoryPoints;
    private int completedStoryPoints;
    private int remainingStoryPoints;
    private double completionPercentage;
}
