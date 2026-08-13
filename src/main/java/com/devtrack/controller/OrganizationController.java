package com.devtrack.controller;

import com.devtrack.dto.*;
import com.devtrack.entity.OrganizationRole;
import com.devtrack.service.OrganizationService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/organizations")
@RequiredArgsConstructor
@Tag(name = "Organization Management", description = "APIs for managing organizations and members")
public class OrganizationController {

    private final OrganizationService organizationService;

    @PostMapping
    @Operation(summary = "Create a new organization")
    public ResponseEntity<OrganizationResponse> createOrganization(
            @Valid @RequestBody OrganizationRequest request,
            Authentication authentication) {
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(organizationService.createOrganization(request, authentication.getName()));
    }

    @GetMapping("/{id}")
    @Operation(summary = "Get organization by ID")
    @PreAuthorize("@orgSecurity.isMember(#id, principal)")
    public ResponseEntity<OrganizationResponse> getOrganization(@PathVariable Long id) {
        return ResponseEntity.ok(organizationService.getOrganization(id));
    }

    @GetMapping
    @Operation(summary = "Get all organizations for current user")
    public ResponseEntity<List<OrganizationResponse>> getUserOrganizations(Authentication authentication) {
        return ResponseEntity.ok(organizationService.getUserOrganizations(authentication.getName()));
    }

    @PostMapping("/{orgId}/invitations")
    @Operation(summary = "Invite a user to the organization")
    @PreAuthorize("@orgSecurity.hasRole(#orgId, principal, 'ADMIN')")
    public ResponseEntity<OrganizationInvitationResponse> inviteUser(
            @PathVariable Long orgId,
            @Valid @RequestBody InviteUserRequest request,
            Authentication authentication) {
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(organizationService.inviteUser(orgId, request, authentication.getName()));
    }

    @PostMapping("/invitations/accept")
    @Operation(summary = "Accept an organization invitation")
    public ResponseEntity<OrganizationMemberResponse> acceptInvitation(
            @RequestParam String token,
            Authentication authentication) {
        return ResponseEntity.ok(organizationService.acceptInvitation(token, authentication.getName()));
    }

    @GetMapping("/{orgId}/members")
    @Operation(summary = "Get all members of an organization")
    @PreAuthorize("@orgSecurity.isMember(#orgId, principal)")
    public ResponseEntity<List<OrganizationMemberResponse>> getOrganizationMembers(
            @PathVariable Long orgId,
            Authentication authentication) {
        return ResponseEntity.ok(organizationService.getOrganizationMembers(orgId, authentication.getName()));
    }

    @DeleteMapping("/{orgId}/members/{userId}")
    @Operation(summary = "Remove a member from an organization")
    @PreAuthorize("@orgSecurity.hasRole(#orgId, principal, 'ADMIN')")
    public ResponseEntity<Void> removeMember(
            @PathVariable Long orgId,
            @PathVariable Long userId,
            Authentication authentication) {
        organizationService.removeMember(orgId, userId, authentication.getName());
        return ResponseEntity.noContent().build();
    }

    @PutMapping("/{orgId}/members/{userId}/role")
    @Operation(summary = "Update a member's role in an organization")
    @PreAuthorize("@orgSecurity.hasRole(#orgId, principal, 'OWNER')")
    public ResponseEntity<OrganizationMemberResponse> updateMemberRole(
            @PathVariable Long orgId,
            @PathVariable Long userId,
            @RequestParam OrganizationRole role,
            Authentication authentication) {
        return ResponseEntity.ok(organizationService.updateMemberRole(orgId, userId, role, authentication.getName()));
    }
}
