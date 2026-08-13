package com.devtrack.service;

import com.devtrack.entity.IssueStatus;
import com.devtrack.exception.BadRequestException;
import org.springframework.stereotype.Component;

import java.util.Map;
import java.util.Set;

@Component
public class WorkflowValidator {

    // Define valid transitions: Key is current status, Value is allowed next statuses
    private static final Map<IssueStatus, Set<IssueStatus>> VALID_TRANSITIONS = Map.of(
            IssueStatus.TODO, Set.of(IssueStatus.IN_PROGRESS, IssueStatus.CLOSED),
            IssueStatus.IN_PROGRESS, Set.of(IssueStatus.TODO, IssueStatus.IN_REVIEW, IssueStatus.CLOSED),
            IssueStatus.IN_REVIEW, Set.of(IssueStatus.IN_PROGRESS, IssueStatus.TESTING, IssueStatus.CLOSED),
            IssueStatus.TESTING, Set.of(IssueStatus.IN_PROGRESS, IssueStatus.DONE, IssueStatus.CLOSED),
            IssueStatus.DONE, Set.of(IssueStatus.IN_PROGRESS, IssueStatus.CLOSED),
            IssueStatus.CLOSED, Set.of(IssueStatus.TODO) // Re-opening
    );

    public void validateTransition(IssueStatus currentStatus, IssueStatus newStatus) {
        if (currentStatus == newStatus) {
            return; // No change
        }

        Set<IssueStatus> allowedTransitions = VALID_TRANSITIONS.get(currentStatus);
        if (allowedTransitions == null || !allowedTransitions.contains(newStatus)) {
            throw new BadRequestException(
                    String.format("Invalid status transition from %s to %s", currentStatus, newStatus)
            );
        }
    }
}
