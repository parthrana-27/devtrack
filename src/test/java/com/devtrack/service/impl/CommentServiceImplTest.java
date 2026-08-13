package com.devtrack.service.impl;

import com.devtrack.dto.CommentRequest;
import com.devtrack.dto.CommentResponse;
import com.devtrack.entity.*;
import com.devtrack.exception.UnauthorizedException;
import com.devtrack.repository.CommentRepository;
import com.devtrack.repository.IssueRepository;
import com.devtrack.repository.UserRepository;
import com.devtrack.security.OrganizationSecurity;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
public class CommentServiceImplTest {

    @Mock
    private CommentRepository commentRepository;

    @Mock
    private IssueRepository issueRepository;

    @Mock
    private UserRepository userRepository;

    @Mock
    private OrganizationSecurity organizationSecurity;

    @InjectMocks
    private CommentServiceImpl commentService;

    private User testUser;
    private User otherUser;
    private Organization testOrganization;
    private Project testProject;
    private Issue testIssue;
    private Comment testComment;

    @BeforeEach
    void setUp() {
        testUser = User.builder().id(1L).name("Test User").email("test@example.com").build();
        otherUser = User.builder().id(2L).name("Other User").email("other@example.com").build();

        testOrganization = Organization.builder().id(1L).name("Test Org").build();
        testProject = Project.builder().id(1L).organization(testOrganization).build();
        testIssue = Issue.builder().id(1L).project(testProject).build();

        testComment = Comment.builder()
                .id(1L)
                .issue(testIssue)
                .author(testUser)
                .content("Initial comment")
                .build();
    }

    @Test
    void addComment_Success() {
        CommentRequest request = new CommentRequest("Hello world!");

        when(issueRepository.findById(1L)).thenReturn(Optional.of(testIssue));
        when(userRepository.findByEmail(testUser.getEmail())).thenReturn(Optional.of(testUser));
        when(organizationSecurity.isMember(1L, testUser.getEmail())).thenReturn(true);
        when(commentRepository.save(any(Comment.class))).thenAnswer(i -> {
            Comment c = i.getArgument(0);
            c.setId(10L);
            return c;
        });

        CommentResponse response = commentService.addComment(1L, request, testUser.getEmail());

        assertNotNull(response);
        assertEquals("Hello world!", response.getContent());
        verify(commentRepository, times(1)).save(any(Comment.class));
    }

    @Test
    void updateComment_ByAuthor_Success() {
        CommentRequest request = new CommentRequest("Updated text");

        when(commentRepository.findById(1L)).thenReturn(Optional.of(testComment));
        when(userRepository.findByEmail(testUser.getEmail())).thenReturn(Optional.of(testUser));
        when(commentRepository.save(any(Comment.class))).thenReturn(testComment);

        CommentResponse response = commentService.updateComment(1L, request, testUser.getEmail());

        assertNotNull(response);
        assertEquals("Updated text", testComment.getContent());
    }

    @Test
    void updateComment_ByOtherUser_ThrowsUnauthorized() {
        CommentRequest request = new CommentRequest("Hacked text");

        when(commentRepository.findById(1L)).thenReturn(Optional.of(testComment));
        when(userRepository.findByEmail(otherUser.getEmail())).thenReturn(Optional.of(otherUser));

        assertThrows(UnauthorizedException.class, () -> {
            commentService.updateComment(1L, request, otherUser.getEmail());
        });

        verify(commentRepository, never()).save(any(Comment.class));
    }
}
