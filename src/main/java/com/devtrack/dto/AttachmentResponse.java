package com.devtrack.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class AttachmentResponse {
    private Long id;
    private Long issueId;
    private String filename;
    private String fileType;
    private Long fileSize;
    private String downloadUrl;
    private Long uploaderId;
    private String uploaderName;
    private LocalDateTime uploadedAt;
}
