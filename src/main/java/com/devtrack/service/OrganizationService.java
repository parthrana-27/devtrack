package com.devtrack.service;

import com.devtrack.dto.*;
import com.devtrack.entity.OrganizationRole;

import java.util.List;

public interface OrganizationService {
    OrganizationResponse createOrganization(OrganizationRequest request, String currentUserEmail);
    OrganizationResponse getOrganization(Long id);
    List<OrganizationResponse> getUserOrganizations(String currentUserEmail);
    
    OrganizationInvitationResponse inviteUser(Long orgId, InviteUserRequest request, String currentUserEmail);
    OrganizationMemberResponse acceptInvitation(String token, String currentUserEmail);
    
    void removeMember(Long orgId, Long userId, String currentUserEmail);
    OrganizationMemberResponse updateMemberRole(Long orgId, Long userId, OrganizationRole role, String currentUserEmail);
    List<OrganizationMemberResponse> getOrganizationMembers(Long orgId, String currentUserEmail);
}
