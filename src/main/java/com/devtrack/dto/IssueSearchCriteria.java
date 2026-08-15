package com.devtrack.dto;

import com.devtrack.entity.IssuePriority;
import com.devtrack.entity.IssueStatus;
import com.devtrack.entity.IssueType;
import lombok.Data;

@Data
public class IssueSearchCriteria {
    private String title;
    private Long assigneeId;
    private IssueStatus status;
    private IssuePriority priority;
    private IssueType type;
}
