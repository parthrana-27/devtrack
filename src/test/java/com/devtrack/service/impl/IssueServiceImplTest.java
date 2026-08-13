package com.devtrack.service.impl;

import com.devtrack.dto.IssueRequest;
import com.devtrack.dto.IssueResponse;
import com.devtrack.entity.*;
import com.devtrack.exception.UnauthorizedException;
import com.devtrack.repository.IssueRepository;
import com.devtrack.repository.ProjectRepository;
import com.devtrack.repository.UserRepository;
import com.devtrack.security.OrganizationSecurity;
import com.devtrack.service.WorkflowValidator;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
public class IssueServiceImplTest {

    @Mock
    private IssueRepository issueRepository;

    @Mock
    private ProjectRepository projectRepository;

    @Mock
    private UserRepository userRepository;

    @Mock
    private OrganizationSecurity organizationSecurity;

    @Mock
    private WorkflowValidator workflowValidator;

    @InjectMocks
    private IssueServiceImpl issueService;

    private User testUser;
    private Organization testOrganization;
    private Project testProject;
    private Issue testIssue;

    @BeforeEach
    void setUp() {
        testUser = User.builder()
                .id(1L)
                .name("Test User")
                .email("test@example.com")
                .build();

        testOrganization = Organization.builder()
                .id(1L)
                .name("Test Org")
                .owner(testUser)
                .build();

        testProject = Project.builder()
                .id(1L)
                .name("Test Project")
                .key("TEST")
                .organization(testOrganization)
                .build();

        testIssue = Issue.builder()
                .id(1L)
                .issueKey("TEST-1")
                .title("Test Issue")
                .project(testProject)
                .creator(testUser)
                .priority(IssuePriority.HIGH)
                .status(IssueStatus.TODO)
                .type(IssueType.BUG)
                .build();
    }

    @Test
    void createIssue_Success() {
        IssueRequest request = new IssueRequest();
        request.setProjectId(1L);
        request.setTitle("New Issue");
        request.setType(IssueType.BUG);
        request.setPriority(IssuePriority.HIGH);

        when(projectRepository.findById(1L)).thenReturn(Optional.of(testProject));
        when(userRepository.findByEmail(testUser.getEmail())).thenReturn(Optional.of(testUser));
        when(organizationSecurity.isMember(1L, testUser.getEmail())).thenReturn(true);
        when(issueRepository.countByProjectId(1L)).thenReturn(0L);
        
        when(issueRepository.save(any(Issue.class))).thenAnswer(invocation -> {
            Issue saved = invocation.getArgument(0);
            saved.setId(10L);
            return saved;
        });

        IssueResponse response = issueService.createIssue(request, testUser.getEmail());

        assertNotNull(response);
        assertEquals("TEST-1", response.getIssueKey());
        assertEquals("New Issue", response.getTitle());
        
        verify(issueRepository, times(1)).save(any(Issue.class));
    }

    @Test
    void createIssue_NotMember_ThrowsUnauthorized() {
        IssueRequest request = new IssueRequest();
        request.setProjectId(1L);

        when(projectRepository.findById(1L)).thenReturn(Optional.of(testProject));
        when(userRepository.findByEmail(testUser.getEmail())).thenReturn(Optional.of(testUser));
        when(organizationSecurity.isMember(1L, testUser.getEmail())).thenReturn(false);

        assertThrows(UnauthorizedException.class, () -> {
            issueService.createIssue(request, testUser.getEmail());
        });
        
        verify(issueRepository, never()).save(any(Issue.class));
    }
}
