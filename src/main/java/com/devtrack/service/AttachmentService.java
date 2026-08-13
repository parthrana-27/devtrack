package com.devtrack.service;

import com.devtrack.dto.AttachmentResponse;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

public interface AttachmentService {
    AttachmentResponse uploadAttachment(Long issueId, MultipartFile file, String currentUserEmail);
    void deleteAttachment(Long attachmentId, String currentUserEmail);
    List<AttachmentResponse> getIssueAttachments(Long issueId, String currentUserEmail);
}
