package com.devtrack.service.impl;

import com.devtrack.dto.*;
import com.devtrack.entity.*;
import com.devtrack.exception.BadRequestException;
import com.devtrack.exception.ResourceNotFoundException;
import com.devtrack.exception.UnauthorizedException;
import com.devtrack.repository.OrganizationInvitationRepository;
import com.devtrack.repository.OrganizationMemberRepository;
import com.devtrack.repository.OrganizationRepository;
import com.devtrack.repository.UserRepository;
import com.devtrack.service.OrganizationService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Slf4j
public class OrganizationServiceImpl implements OrganizationService {

    private final OrganizationRepository organizationRepository;
    private final OrganizationMemberRepository organizationMemberRepository;
    private final OrganizationInvitationRepository organizationInvitationRepository;
    private final UserRepository userRepository;

    @Override
    @Transactional
    public OrganizationResponse createOrganization(OrganizationRequest request, String currentUserEmail) {
        User currentUser = getUserByEmail(currentUserEmail);

        Organization organization = Organization.builder()
                .name(request.getName())
                .description(request.getDescription())
                .owner(currentUser)
                .build();
                
        organization = organizationRepository.save(organization);

        OrganizationMember member = OrganizationMember.builder()
                .organization(organization)
                .user(currentUser)
                .role(OrganizationRole.OWNER)
                .build();
        organizationMemberRepository.save(member);

        return mapToOrganizationResponse(organization);
    }

    @Override
    public OrganizationResponse getOrganization(Long id) {
        Organization organization = organizationRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Organization not found"));
        return mapToOrganizationResponse(organization);
    }

    @Override
    public List<OrganizationResponse> getUserOrganizations(String currentUserEmail) {
        User currentUser = getUserByEmail(currentUserEmail);
        return organizationMemberRepository.findByUserId(currentUser.getId()).stream()
                .map(member -> mapToOrganizationResponse(member.getOrganization()))
                .collect(Collectors.toList());
    }

    @Override
    @Transactional
    public OrganizationInvitationResponse inviteUser(Long orgId, InviteUserRequest request, String currentUserEmail) {
        User currentUser = getUserByEmail(currentUserEmail);
        Organization organization = getOrganizationEntity(orgId);

        checkHasRole(organization.getId(), currentUser.getId(), List.of(OrganizationRole.OWNER, OrganizationRole.ADMIN));

        // Check if user is already a member
        userRepository.findByEmail(request.getEmail()).ifPresent(invitedUser -> {
            if (organizationMemberRepository.existsByOrganizationIdAndUserId(orgId, invitedUser.getId())) {
                throw new BadRequestException("User is already a member of this organization");
            }
        });
        
        // Check if there is already a pending invitation
        if (organizationInvitationRepository.existsByOrganizationIdAndEmailAndStatus(orgId, request.getEmail(), InvitationStatus.PENDING)) {
            throw new BadRequestException("A pending invitation already exists for this email");
        }

        String token = UUID.randomUUID().toString();
        OrganizationInvitation invitation = OrganizationInvitation.builder()
                .organization(organization)
                .email(request.getEmail())
                .token(token)
                .status(InvitationStatus.PENDING)
                .invitedBy(currentUser)
                .role(request.getRole())
                .expiresAt(LocalDateTime.now().plusDays(7))
                .build();

        invitation = organizationInvitationRepository.save(invitation);

        log.info("MOCK EMAIL: Invitation sent to {} with token {}", request.getEmail(), token);

        return mapToInvitationResponse(invitation);
    }

    @Override
    @Transactional
    public OrganizationMemberResponse acceptInvitation(String token, String currentUserEmail) {
        User currentUser = getUserByEmail(currentUserEmail);
        
        OrganizationInvitation invitation = organizationInvitationRepository.findByToken(token)
                .orElseThrow(() -> new ResourceNotFoundException("Invalid invitation token"));

        if (!invitation.getEmail().equals(currentUser.getEmail())) {
            throw new UnauthorizedException("This invitation is not for your email address");
        }

        if (invitation.getStatus() != InvitationStatus.PENDING) {
            throw new BadRequestException("Invitation is no longer valid");
        }

        if (invitation.getExpiresAt().isBefore(LocalDateTime.now())) {
            invitation.setStatus(InvitationStatus.EXPIRED);
            organizationInvitationRepository.save(invitation);
            throw new BadRequestException("Invitation has expired");
        }

        OrganizationMember member = OrganizationMember.builder()
                .organization(invitation.getOrganization())
                .user(currentUser)
                .role(invitation.getRole())
                .build();

        member = organizationMemberRepository.save(member);

        invitation.setStatus(InvitationStatus.ACCEPTED);
        organizationInvitationRepository.save(invitation);

        return mapToMemberResponse(member);
    }

    @Override
    @Transactional
    public void removeMember(Long orgId, Long userId, String currentUserEmail) {
        User currentUser = getUserByEmail(currentUserEmail);
        
        checkHasRole(orgId, currentUser.getId(), List.of(OrganizationRole.OWNER, OrganizationRole.ADMIN));
        
        OrganizationMember memberToRemove = organizationMemberRepository.findByOrganizationIdAndUserId(orgId, userId)
                .orElseThrow(() -> new ResourceNotFoundException("Member not found in this organization"));
                
        if (memberToRemove.getRole() == OrganizationRole.OWNER) {
            throw new BadRequestException("Cannot remove the organization owner");
        }
        
        organizationMemberRepository.delete(memberToRemove);
    }

    @Override
    @Transactional
    public OrganizationMemberResponse updateMemberRole(Long orgId, Long userId, OrganizationRole role, String currentUserEmail) {
         User currentUser = getUserByEmail(currentUserEmail);
         
         checkHasRole(orgId, currentUser.getId(), List.of(OrganizationRole.OWNER, OrganizationRole.ADMIN));
         
         OrganizationMember memberToUpdate = organizationMemberRepository.findByOrganizationIdAndUserId(orgId, userId)
                .orElseThrow(() -> new ResourceNotFoundException("Member not found in this organization"));
                
         if (memberToUpdate.getRole() == OrganizationRole.OWNER) {
            throw new BadRequestException("Cannot change the role of the organization owner");
         }
         
         memberToUpdate.setRole(role);
         memberToUpdate = organizationMemberRepository.save(memberToUpdate);
         
         return mapToMemberResponse(memberToUpdate);
    }

    @Override
    public List<OrganizationMemberResponse> getOrganizationMembers(Long orgId, String currentUserEmail) {
        User currentUser = getUserByEmail(currentUserEmail);
        
        // Ensure current user is part of the org
        organizationMemberRepository.findByOrganizationIdAndUserId(orgId, currentUser.getId())
                .orElseThrow(() -> new UnauthorizedException("You are not a member of this organization"));

        return organizationMemberRepository.findByOrganizationId(orgId).stream()
                .map(this::mapToMemberResponse)
                .collect(Collectors.toList());
    }
    
    // Helper Methods

    private User getUserByEmail(String email) {
        return userRepository.findByEmail(email)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));
    }
    
    private Organization getOrganizationEntity(Long id) {
        return organizationRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Organization not found"));
    }

    private void checkHasRole(Long orgId, Long userId, List<OrganizationRole> allowedRoles) {
        OrganizationMember member = organizationMemberRepository.findByOrganizationIdAndUserId(orgId, userId)
                .orElseThrow(() -> new UnauthorizedException("You are not a member of this organization"));
                
        if (!allowedRoles.contains(member.getRole())) {
            throw new UnauthorizedException("You do not have the required role to perform this action");
        }
    }

    private OrganizationResponse mapToOrganizationResponse(Organization organization) {
        return OrganizationResponse.builder()
                .id(organization.getId())
                .name(organization.getName())
                .description(organization.getDescription())
                .ownerId(organization.getOwner().getId())
                .ownerName(organization.getOwner().getName())
                .createdAt(organization.getCreatedAt())
                .updatedAt(organization.getUpdatedAt())
                .build();
    }

    private OrganizationMemberResponse mapToMemberResponse(OrganizationMember member) {
        return OrganizationMemberResponse.builder()
                .id(member.getId())
                .userId(member.getUser().getId())
                .userName(member.getUser().getName())
                .userEmail(member.getUser().getEmail())
                .role(member.getRole())
                .joinedAt(member.getJoinedAt())
                .build();
    }

    private OrganizationInvitationResponse mapToInvitationResponse(OrganizationInvitation invitation) {
        return OrganizationInvitationResponse.builder()
                .id(invitation.getId())
                .email(invitation.getEmail())
                .role(invitation.getRole())
                .status(invitation.getStatus())
                .invitedById(invitation.getInvitedBy().getId())
                .invitedByName(invitation.getInvitedBy().getName())
                .createdAt(invitation.getCreatedAt())
                .expiresAt(invitation.getExpiresAt())
                .build();
    }
}
