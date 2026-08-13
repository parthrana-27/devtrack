package com.devtrack.service.impl;

import com.devtrack.dto.AttachmentResponse;
import com.devtrack.entity.Attachment;
import com.devtrack.entity.Issue;
import com.devtrack.entity.User;
import com.devtrack.exception.ResourceNotFoundException;
import com.devtrack.exception.UnauthorizedException;
import com.devtrack.repository.AttachmentRepository;
import com.devtrack.repository.IssueRepository;
import com.devtrack.repository.UserRepository;
import com.devtrack.security.OrganizationSecurity;
import com.devtrack.service.AttachmentService;
import com.devtrack.service.FileStorageService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.servlet.support.ServletUriComponentsBuilder;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class AttachmentServiceImpl implements AttachmentService {

    private final AttachmentRepository attachmentRepository;
    private final IssueRepository issueRepository;
    private final UserRepository userRepository;
    private final OrganizationSecurity organizationSecurity;
    private final FileStorageService fileStorageService;

    @Override
    @Transactional
    public AttachmentResponse uploadAttachment(Long issueId, MultipartFile file, String currentUserEmail) {
        Issue issue = issueRepository.findById(issueId)
                .orElseThrow(() -> new ResourceNotFoundException("Issue not found"));
        User currentUser = getUserByEmail(currentUserEmail);

        if (!organizationSecurity.isMember(issue.getProject().getOrganization().getId(), currentUserEmail)) {
            throw new UnauthorizedException("You must be a member of the organization to upload attachments");
        }

        String storedFileName = fileStorageService.storeFile(file);

        Attachment attachment = Attachment.builder()
                .issue(issue)
                .filename(file.getOriginalFilename())
                .fileType(file.getContentType())
                .fileSize(file.getSize())
                .storageLocation(storedFileName)
                .uploader(currentUser)
                .build();

        attachment = attachmentRepository.save(attachment);
        
        return mapToResponse(attachment);
    }

    @Override
    @Transactional
    public void deleteAttachment(Long attachmentId, String currentUserEmail) {
        Attachment attachment = attachmentRepository.findById(attachmentId)
                .orElseThrow(() -> new ResourceNotFoundException("Attachment not found"));
        User currentUser = getUserByEmail(currentUserEmail);

        boolean isUploader = attachment.getUploader().getId().equals(currentUser.getId());
        boolean isOrgAdminOrOwner = organizationSecurity.hasRole(attachment.getIssue().getProject().getOrganization().getId(), currentUserEmail, "ADMIN")
                                 || organizationSecurity.hasRole(attachment.getIssue().getProject().getOrganization().getId(), currentUserEmail, "OWNER");

        if (!isUploader && !isOrgAdminOrOwner) {
            throw new UnauthorizedException("Only the uploader or an organization admin can delete this attachment");
        }

        // Delete file from disk
        fileStorageService.deleteFile(attachment.getStorageLocation());
        
        // Delete from DB
        attachmentRepository.delete(attachment);
    }

    @Override
    @Transactional(readOnly = true)
    public List<AttachmentResponse> getIssueAttachments(Long issueId, String currentUserEmail) {
        Issue issue = issueRepository.findById(issueId)
                .orElseThrow(() -> new ResourceNotFoundException("Issue not found"));

        if (!organizationSecurity.isMember(issue.getProject().getOrganization().getId(), currentUserEmail)) {
            throw new UnauthorizedException("You do not have access to this issue's attachments");
        }

        return attachmentRepository.findByIssueIdOrderByUploadedAtDesc(issueId).stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    private User getUserByEmail(String email) {
        return userRepository.findByEmail(email)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));
    }

    private AttachmentResponse mapToResponse(Attachment attachment) {
        String fileDownloadUri = ServletUriComponentsBuilder.fromCurrentContextPath()
                .path("/api/attachments/download/")
                .path(attachment.getStorageLocation())
                .toUriString();

        return AttachmentResponse.builder()
                .id(attachment.getId())
                .issueId(attachment.getIssue().getId())
                .filename(attachment.getFilename())
                .fileType(attachment.getFileType())
                .fileSize(attachment.getFileSize())
                .downloadUrl(fileDownloadUri)
                .uploaderId(attachment.getUploader().getId())
                .uploaderName(attachment.getUploader().getName())
                .uploadedAt(attachment.getUploadedAt())
                .build();
    }
}
