package com.devtrack.service.impl;

import com.devtrack.dto.SprintMetricsResponse;
import com.devtrack.entity.*;
import com.devtrack.repository.IssueRepository;
import com.devtrack.repository.ProjectRepository;
import com.devtrack.repository.SprintRepository;
import com.devtrack.security.OrganizationSecurity;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertNotNull;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
public class SprintServiceImplTest {

    @Mock
    private SprintRepository sprintRepository;

    @Mock
    private ProjectRepository projectRepository;

    @Mock
    private IssueRepository issueRepository;

    @Mock
    private OrganizationSecurity organizationSecurity;

    @InjectMocks
    private SprintServiceImpl sprintService;

    private Organization testOrganization;
    private Project testProject;
    private Sprint testSprint;
    private Issue issue1;
    private Issue issue2;
    private Issue issue3;

    @BeforeEach
    void setUp() {
        testOrganization = Organization.builder().id(1L).name("Test Org").build();
        testProject = Project.builder().id(1L).organization(testOrganization).build();
        
        testSprint = Sprint.builder()
                .id(1L)
                .name("Sprint 1")
                .project(testProject)
                .status(SprintStatus.ACTIVE)
                .build();
                
        issue1 = Issue.builder().id(101L).storyPoints(5).status(IssueStatus.DONE).build();
        issue2 = Issue.builder().id(102L).storyPoints(3).status(IssueStatus.IN_PROGRESS).build();
        issue3 = Issue.builder().id(103L).storyPoints(2).status(IssueStatus.CLOSED).build();
        
        testSprint.setIssues(List.of(issue1, issue2, issue3));
    }

    @Test
    void getSprintMetrics_Success() {
        when(sprintRepository.findById(1L)).thenReturn(Optional.of(testSprint));
        when(organizationSecurity.isMember(1L, "user@example.com")).thenReturn(true);

        SprintMetricsResponse metrics = sprintService.getSprintMetrics(1L, "user@example.com");

        assertNotNull(metrics);
        assertEquals(10, metrics.getTotalStoryPoints());
        assertEquals(7, metrics.getCompletedStoryPoints()); // issue1 (5) + issue3 (2)
        assertEquals(3, metrics.getRemainingStoryPoints()); // issue2 (3)
        assertEquals(70.0, metrics.getCompletionPercentage());
    }
}
