package com.devtrack.dto;

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
public class OrganizationMemberResponse {
    private Long id;
    private Long userId;
    private String userName;
    private String userEmail;
    private OrganizationRole role;
    private LocalDateTime joinedAt;
}
