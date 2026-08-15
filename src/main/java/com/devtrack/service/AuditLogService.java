package com.devtrack.service;

import com.devtrack.entity.AuditLog;
import com.devtrack.entity.User;
import com.devtrack.repository.AuditLogRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Propagation;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
@Slf4j
public class AuditLogService {

    private final AuditLogRepository auditLogRepository;

    @Transactional(propagation = Propagation.MANDATORY)
    public void logAction(User user, String action, String entityType, String entityId, String metadata) {
        AuditLog auditLog = AuditLog.builder()
                .user(user)
                .action(action)
                .entityType(entityType)
                .entityId(entityId)
                .metadata(metadata)
                .build();
        auditLogRepository.save(auditLog);
        log.debug("Audit log saved: {} {} {}", user.getEmail(), action, entityId);
    }
}
