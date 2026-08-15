package com.devtrack.service;

import com.devtrack.dto.IssueRequest;
import com.devtrack.dto.IssueResponse;
import com.devtrack.dto.IssueSearchCriteria;
import com.devtrack.dto.IssueUpdateRequest;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

public interface IssueService {
    IssueResponse createIssue(IssueRequest request, String currentUserEmail);
    IssueResponse getIssue(Long id, String currentUserEmail);
    IssueResponse getIssueByKey(String issueKey, String currentUserEmail);
    Page<IssueResponse> getProjectIssues(Long projectId, Pageable pageable, String currentUserEmail);
    Page<IssueResponse> searchIssues(Long projectId, IssueSearchCriteria criteria, Pageable pageable, String currentUserEmail);
    IssueResponse updateIssue(Long id, IssueUpdateRequest request, String currentUserEmail);
    void deleteIssue(Long id, String currentUserEmail);
}
