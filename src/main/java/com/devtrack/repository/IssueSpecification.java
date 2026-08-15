package com.devtrack.repository;

import com.devtrack.dto.IssueSearchCriteria;
import com.devtrack.entity.Issue;
import jakarta.persistence.criteria.Predicate;
import org.springframework.data.jpa.domain.Specification;

import java.util.ArrayList;
import java.util.List;

public class IssueSpecification {

    public static Specification<Issue> searchIssues(Long projectId, IssueSearchCriteria criteria) {
        return (root, query, cb) -> {
            List<Predicate> predicates = new ArrayList<>();
            
            predicates.add(cb.equal(root.get("project").get("id"), projectId));
            
            if (criteria.getTitle() != null && !criteria.getTitle().isEmpty()) {
                predicates.add(cb.like(cb.lower(root.get("title")), "%" + criteria.getTitle().toLowerCase() + "%"));
            }
            if (criteria.getAssigneeId() != null) {
                predicates.add(cb.equal(root.get("assignee").get("id"), criteria.getAssigneeId()));
            }
            if (criteria.getStatus() != null) {
                predicates.add(cb.equal(root.get("status"), criteria.getStatus()));
            }
            if (criteria.getPriority() != null) {
                predicates.add(cb.equal(root.get("priority"), criteria.getPriority()));
            }
            if (criteria.getType() != null) {
                predicates.add(cb.equal(root.get("type"), criteria.getType()));
            }
            
            return cb.and(predicates.toArray(new Predicate[0]));
        };
    }
}
