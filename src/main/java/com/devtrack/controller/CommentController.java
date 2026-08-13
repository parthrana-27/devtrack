package com.devtrack.controller;

import com.devtrack.dto.CommentRequest;
import com.devtrack.dto.CommentResponse;
import com.devtrack.service.CommentService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/comments")
@RequiredArgsConstructor
@Tag(name = "Comment Management", description = "APIs for issue discussions")
public class CommentController {

    private final CommentService commentService;

    @PostMapping("/issue/{issueId}")
    @Operation(summary = "Add a comment to an issue")
    public ResponseEntity<CommentResponse> addComment(
            @PathVariable Long issueId,
            @Valid @RequestBody CommentRequest request,
            Authentication authentication) {
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(commentService.addComment(issueId, request, authentication.getName()));
    }

    @GetMapping("/issue/{issueId}")
    @Operation(summary = "Get all comments for an issue")
    public ResponseEntity<List<CommentResponse>> getIssueComments(
            @PathVariable Long issueId,
            Authentication authentication) {
        return ResponseEntity.ok(commentService.getIssueComments(issueId, authentication.getName()));
    }

    @PutMapping("/{commentId}")
    @Operation(summary = "Update a comment")
    public ResponseEntity<CommentResponse> updateComment(
            @PathVariable Long commentId,
            @Valid @RequestBody CommentRequest request,
            Authentication authentication) {
        return ResponseEntity.ok(commentService.updateComment(commentId, request, authentication.getName()));
    }

    @DeleteMapping("/{commentId}")
    @Operation(summary = "Delete a comment")
    public ResponseEntity<Void> deleteComment(
            @PathVariable Long commentId,
            Authentication authentication) {
        commentService.deleteComment(commentId, authentication.getName());
        return ResponseEntity.noContent().build();
    }
}
