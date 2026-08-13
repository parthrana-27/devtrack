package com.devtrack.security;

import com.devtrack.entity.OrganizationRole;
import com.devtrack.entity.User;
import com.devtrack.repository.OrganizationMemberRepository;
import com.devtrack.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

@Component("orgSecurity")
@RequiredArgsConstructor
public class OrganizationSecurity {

    private final OrganizationMemberRepository organizationMemberRepository;
    private final UserRepository userRepository;

    @Transactional(readOnly = true)
    public boolean hasRole(Long orgId, Object principal, String role) {
        if (principal == null) {
            return false;
        }

        String email = "";
        if (principal instanceof UserDetails) {
            email = ((UserDetails) principal).getUsername();
        } else if (principal instanceof String) {
            email = (String) principal;
        }

        if (email.isEmpty()) {
            return false;
        }

        User user = userRepository.findByEmail(email).orElse(null);
        if (user == null) {
            return false;
        }

        OrganizationRole requiredRole;
        try {
            requiredRole = OrganizationRole.valueOf(role);
        } catch (IllegalArgumentException e) {
            return false;
        }

        return organizationMemberRepository.findByOrganizationIdAndUserId(orgId, user.getId())
                .map(member -> isRoleSufficient(member.getRole(), requiredRole))
                .orElse(false);
    }
    
    @Transactional(readOnly = true)
    public boolean isMember(Long orgId, Object principal) {
        return hasRole(orgId, principal, "MEMBER");
    }

    private boolean isRoleSufficient(OrganizationRole userRole, OrganizationRole requiredRole) {
        if (userRole == OrganizationRole.OWNER) {
            return true;
        }
        if (userRole == OrganizationRole.ADMIN && (requiredRole == OrganizationRole.ADMIN || requiredRole == OrganizationRole.MEMBER)) {
            return true;
        }
        return userRole == OrganizationRole.MEMBER && requiredRole == OrganizationRole.MEMBER;
    }
}
