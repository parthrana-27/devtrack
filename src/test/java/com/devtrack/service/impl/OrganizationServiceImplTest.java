package com.devtrack.service.impl;

import com.devtrack.dto.OrganizationRequest;
import com.devtrack.dto.OrganizationResponse;
import com.devtrack.entity.Organization;
import com.devtrack.entity.OrganizationMember;
import com.devtrack.entity.OrganizationRole;
import com.devtrack.entity.User;
import com.devtrack.repository.OrganizationInvitationRepository;
import com.devtrack.repository.OrganizationMemberRepository;
import com.devtrack.repository.OrganizationRepository;
import com.devtrack.repository.UserRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.time.LocalDateTime;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
public class OrganizationServiceImplTest {

    @Mock
    private OrganizationRepository organizationRepository;

    @Mock
    private OrganizationMemberRepository organizationMemberRepository;

    @Mock
    private OrganizationInvitationRepository organizationInvitationRepository;

    @Mock
    private UserRepository userRepository;

    @InjectMocks
    private OrganizationServiceImpl organizationService;

    private User testUser;
    private Organization testOrganization;

    @BeforeEach
    void setUp() {
        testUser = User.builder()
                .id(1L)
                .name("Test User")
                .email("test@example.com")
                .password("password")
                .build();

        testOrganization = Organization.builder()
                .id(1L)
                .name("Test Org")
                .description("Test Description")
                .owner(testUser)
                .createdAt(LocalDateTime.now())
                .build();
    }

    @Test
    void createOrganization_Success() {
        OrganizationRequest request = new OrganizationRequest("Test Org", "Test Description");

        when(userRepository.findByEmail(testUser.getEmail())).thenReturn(Optional.of(testUser));
        when(organizationRepository.save(any(Organization.class))).thenReturn(testOrganization);

        OrganizationResponse response = organizationService.createOrganization(request, testUser.getEmail());

        assertNotNull(response);
        assertEquals("Test Org", response.getName());
        assertEquals("Test Description", response.getDescription());
        assertEquals(testUser.getId(), response.getOwnerId());
        
        verify(organizationRepository, times(1)).save(any(Organization.class));
        verify(organizationMemberRepository, times(1)).save(any(OrganizationMember.class));
    }
}
