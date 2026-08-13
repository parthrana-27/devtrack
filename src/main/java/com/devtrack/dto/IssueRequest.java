package com.devtrack.dto;

import com.devtrack.entity.IssuePriority;
import com.devtrack.entity.IssueType;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
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
public class IssueRequest {

    @NotNull(message = "Project ID is required")
    private Long projectId;

    @NotBlank(message = "Title is required")
    @Size(min = 2, max = 255, message = "Title must be between 2 and 255 characters")
    private String title;

    private String description;

    @NotNull(message = "Issue type is required")
    private IssueType type;

    @NotNull(message = "Issue priority is required")
    private IssuePriority priority;

    private Long assigneeId;

    private Integer storyPoints;

    private LocalDate dueDate;
}
