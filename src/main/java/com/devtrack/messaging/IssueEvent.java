package com.devtrack.messaging;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.io.Serializable;
import java.time.LocalDateTime;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class IssueEvent implements Serializable {
    private Long issueId;
    private String issueKey;
    private String action; // e.g., "CREATED", "STATUS_CHANGED", "ASSIGNED"
    private String triggeredByEmail;
    private LocalDateTime timestamp;
    private String message;
}
