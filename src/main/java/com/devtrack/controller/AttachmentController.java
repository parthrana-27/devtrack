package com.devtrack.controller;

import com.devtrack.dto.AttachmentResponse;
import com.devtrack.service.AttachmentService;
import com.devtrack.service.FileStorageService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.servlet.http.HttpServletRequest;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.core.io.Resource;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.List;

@RestController
@RequestMapping("/api/attachments")
@RequiredArgsConstructor
@Slf4j
@Tag(name = "Attachment Management", description = "APIs for uploading and downloading files")
public class AttachmentController {

    private final AttachmentService attachmentService;
    private final FileStorageService fileStorageService;

    @PostMapping(value = "/issue/{issueId}", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    @Operation(summary = "Upload an attachment to an issue")
    public ResponseEntity<AttachmentResponse> uploadAttachment(
            @PathVariable Long issueId,
            @RequestParam("file") MultipartFile file,
            Authentication authentication) {
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(attachmentService.uploadAttachment(issueId, file, authentication.getName()));
    }

    @GetMapping("/issue/{issueId}")
    @Operation(summary = "Get all attachments for an issue")
    public ResponseEntity<List<AttachmentResponse>> getIssueAttachments(
            @PathVariable Long issueId,
            Authentication authentication) {
        return ResponseEntity.ok(attachmentService.getIssueAttachments(issueId, authentication.getName()));
    }

    @DeleteMapping("/{attachmentId}")
    @Operation(summary = "Delete an attachment")
    public ResponseEntity<Void> deleteAttachment(
            @PathVariable Long attachmentId,
            Authentication authentication) {
        attachmentService.deleteAttachment(attachmentId, authentication.getName());
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/download/{fileName:.+}")
    @Operation(summary = "Download an attachment file")
    public ResponseEntity<Resource> downloadFile(@PathVariable String fileName, HttpServletRequest request) {
        // NOTE: This download endpoint is currently public for simplicity, but in a real app,
        // it should check if the user has read access to the issue the attachment belongs to.
        Resource resource = fileStorageService.loadFileAsResource(fileName);

        // Try to determine file's content type
        String contentType = null;
        try {
            contentType = request.getServletContext().getMimeType(resource.getFile().getAbsolutePath());
        } catch (IOException ex) {
            log.info("Could not determine file type.");
        }

        // Fallback to the default content type if type could not be determined
        if (contentType == null) {
            contentType = "application/octet-stream";
        }

        return ResponseEntity.ok()
                .contentType(MediaType.parseMediaType(contentType))
                .header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=\"" + resource.getFilename() + "\"")
                .body(resource);
    }
}
