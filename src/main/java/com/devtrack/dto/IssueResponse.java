package com.devtrack.dto;

import com.devtrack.entity.IssuePriority;
import com.devtrack.entity.IssueStatus;
import com.devtrack.entity.IssueType;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;
import java.time.LocalDateTime;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class IssueResponse {
    private Long id;
    private String issueKey;
    private String title;
    private String description;
    
    private Long projectId;
    private String projectName;
    private String projectKey;
    
    private Long creatorId;
    private String creatorName;
    
    private Long assigneeId;
    private String assigneeName;
    
    private IssuePriority priority;
    private IssueStatus status;
    private IssueType type;
    
    private Integer storyPoints;
    private LocalDate dueDate;
    
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}
