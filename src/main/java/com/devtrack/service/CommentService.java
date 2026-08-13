package com.devtrack.service;

import com.devtrack.dto.CommentRequest;
import com.devtrack.dto.CommentResponse;

import java.util.List;

public interface CommentService {
    CommentResponse addComment(Long issueId, CommentRequest request, String currentUserEmail);
    CommentResponse updateComment(Long commentId, CommentRequest request, String currentUserEmail);
    void deleteComment(Long commentId, String currentUserEmail);
    List<CommentResponse> getIssueComments(Long issueId, String currentUserEmail);
}
