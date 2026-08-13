package com.devtrack.service.impl;

import com.devtrack.dto.ProjectRequest;
import com.devtrack.dto.ProjectResponse;
import com.devtrack.entity.Organization;
import com.devtrack.entity.Project;
import com.devtrack.entity.ProjectStatus;
import com.devtrack.entity.User;
import com.devtrack.exception.UnauthorizedException;
import com.devtrack.repository.OrganizationRepository;
import com.devtrack.repository.ProjectRepository;
import com.devtrack.repository.UserRepository;
import com.devtrack.security.OrganizationSecurity;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
public class ProjectServiceImplTest {

    @Mock
    private ProjectRepository projectRepository;

    @Mock
    private OrganizationRepository organizationRepository;

    @Mock
    private UserRepository userRepository;

    @Mock
    private OrganizationSecurity organizationSecurity;

    @InjectMocks
    private ProjectServiceImpl projectService;

    private User testUser;
    private Organization testOrganization;
    private Project testProject;

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
                .projectManager(testUser)
                .status(ProjectStatus.PLANNING)
                .build();
    }

    @Test
    void createProject_Success() {
        ProjectRequest request = new ProjectRequest("Test Project", "TEST", "Desc", 1L, null);

        when(userRepository.findByEmail(testUser.getEmail())).thenReturn(Optional.of(testUser));
        when(organizationRepository.findById(1L)).thenReturn(Optional.of(testOrganization));
        when(organizationSecurity.hasRole(1L, testUser.getEmail(), "ADMIN")).thenReturn(true);
        when(projectRepository.existsByKeyAndOrganizationId("TEST", 1L)).thenReturn(false);
        when(projectRepository.save(any(Project.class))).thenReturn(testProject);

        ProjectResponse response = projectService.createProject(request, testUser.getEmail());

        assertNotNull(response);
        assertEquals("Test Project", response.getName());
        assertEquals("TEST", response.getKey());
        
        verify(projectRepository, times(1)).save(any(Project.class));
    }

    @Test
    void createProject_Unauthorized_ThrowsException() {
        ProjectRequest request = new ProjectRequest("Test Project", "TEST", "Desc", 1L, null);

        when(userRepository.findByEmail(testUser.getEmail())).thenReturn(Optional.of(testUser));
        when(organizationRepository.findById(1L)).thenReturn(Optional.of(testOrganization));
        when(organizationSecurity.hasRole(1L, testUser.getEmail(), "ADMIN")).thenReturn(false);

        assertThrows(UnauthorizedException.class, () -> {
            projectService.createProject(request, testUser.getEmail());
        });
        
        verify(projectRepository, never()).save(any(Project.class));
    }
}
