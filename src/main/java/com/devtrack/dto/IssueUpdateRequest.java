package com.devtrack.dto;

import com.devtrack.entity.IssuePriority;
import com.devtrack.entity.IssueStatus;
import com.devtrack.entity.IssueType;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class IssueUpdateRequest {

    @Size(min = 2, max = 255, message = "Title must be between 2 and 255 characters")
    private String title;

    private String description;
    
    private Long assigneeId;
    
    private IssueType type;
    
    private IssuePriority priority;
    
    private IssueStatus status;

    private Integer storyPoints;

    private LocalDate dueDate;
}
