package com.devtrack.service.impl;

import com.devtrack.dto.CommentRequest;
import com.devtrack.dto.CommentResponse;
import com.devtrack.entity.Comment;
import com.devtrack.entity.Issue;
import com.devtrack.entity.User;
import com.devtrack.exception.ResourceNotFoundException;
import com.devtrack.exception.UnauthorizedException;
import com.devtrack.repository.CommentRepository;
import com.devtrack.repository.IssueRepository;
import com.devtrack.repository.UserRepository;
import com.devtrack.security.OrganizationSecurity;
import com.devtrack.service.CommentService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class CommentServiceImpl implements CommentService {

    private final CommentRepository commentRepository;
    private final IssueRepository issueRepository;
    private final UserRepository userRepository;
    private final OrganizationSecurity organizationSecurity;

    @Override
    @Transactional
    public CommentResponse addComment(Long issueId, CommentRequest request, String currentUserEmail) {
        Issue issue = issueRepository.findById(issueId)
                .orElseThrow(() -> new ResourceNotFoundException("Issue not found"));
        User currentUser = getUserByEmail(currentUserEmail);

        if (!organizationSecurity.isMember(issue.getProject().getOrganization().getId(), currentUserEmail)) {
            throw new UnauthorizedException("You must be a member of the organization to comment");
        }

        Comment comment = Comment.builder()
                .issue(issue)
                .author(currentUser)
                .content(request.getContent())
                .build();

        comment = commentRepository.save(comment);
        
        // TODO: Later parse request.getContent() for @mentions and fire Kafka events
        
        return mapToResponse(comment);
    }

    @Override
    @Transactional
    public CommentResponse updateComment(Long commentId, CommentRequest request, String currentUserEmail) {
        Comment comment = commentRepository.findById(commentId)
                .orElseThrow(() -> new ResourceNotFoundException("Comment not found"));
        User currentUser = getUserByEmail(currentUserEmail);

        if (!comment.getAuthor().getId().equals(currentUser.getId())) {
            throw new UnauthorizedException("You can only edit your own comments");
        }

        comment.setContent(request.getContent());
        comment = commentRepository.save(comment);
        
        return mapToResponse(comment);
    }

    @Override
    @Transactional
    public void deleteComment(Long commentId, String currentUserEmail) {
        Comment comment = commentRepository.findById(commentId)
                .orElseThrow(() -> new ResourceNotFoundException("Comment not found"));
        User currentUser = getUserByEmail(currentUserEmail);

        boolean isAuthor = comment.getAuthor().getId().equals(currentUser.getId());
        boolean isOrgAdminOrOwner = organizationSecurity.hasRole(comment.getIssue().getProject().getOrganization().getId(), currentUserEmail, "ADMIN")
                                 || organizationSecurity.hasRole(comment.getIssue().getProject().getOrganization().getId(), currentUserEmail, "OWNER");

        if (!isAuthor && !isOrgAdminOrOwner) {
            throw new UnauthorizedException("Only the author or an organization admin can delete this comment");
        }

        commentRepository.delete(comment);
    }

    @Override
    @Transactional(readOnly = true)
    public List<CommentResponse> getIssueComments(Long issueId, String currentUserEmail) {
        Issue issue = issueRepository.findById(issueId)
                .orElseThrow(() -> new ResourceNotFoundException("Issue not found"));

        if (!organizationSecurity.isMember(issue.getProject().getOrganization().getId(), currentUserEmail)) {
            throw new UnauthorizedException("You do not have access to this issue's comments");
        }

        return commentRepository.findByIssueIdOrderByCreatedAtAsc(issueId).stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    private User getUserByEmail(String email) {
        return userRepository.findByEmail(email)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));
    }

    private CommentResponse mapToResponse(Comment comment) {
        return CommentResponse.builder()
                .id(comment.getId())
                .issueId(comment.getIssue().getId())
                .authorId(comment.getAuthor().getId())
                .authorName(comment.getAuthor().getName())
                .content(comment.getContent())
                .createdAt(comment.getCreatedAt())
                .updatedAt(comment.getUpdatedAt())
                .build();
    }
}
