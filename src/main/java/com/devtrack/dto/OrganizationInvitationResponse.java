package com.devtrack.dto;

import com.devtrack.entity.InvitationStatus;
import com.devtrack.entity.OrganizationRole;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class OrganizationInvitationResponse {
    private Long id;
    private String email;
    private OrganizationRole role;
    private InvitationStatus status;
    private Long invitedById;
    private String invitedByName;
    private LocalDateTime createdAt;
    private LocalDateTime expiresAt;
}
