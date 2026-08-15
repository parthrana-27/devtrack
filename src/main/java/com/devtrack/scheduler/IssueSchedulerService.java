package com.devtrack.scheduler;

import com.devtrack.entity.Issue;
import com.devtrack.entity.IssueStatus;
import com.devtrack.messaging.IssueEvent;
import com.devtrack.messaging.KafkaProducerService;
import com.devtrack.repository.IssueRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;

@Service
@RequiredArgsConstructor
@Slf4j
public class IssueSchedulerService {

    private final IssueRepository issueRepository;
    private final KafkaProducerService kafkaProducerService;

    // Run every day at midnight
    @Scheduled(cron = "0 0 0 * * ?")
    @Transactional(readOnly = true)
    public void checkOverdueIssues() {
        log.info("Starting scheduled job: checkOverdueIssues");
        LocalDate today = LocalDate.now();
        
        List<Issue> overdueIssues = issueRepository.findByDueDateBeforeAndStatusNot(today, IssueStatus.DONE);
        
        for (Issue issue : overdueIssues) {
            log.warn("Issue {} is overdue!", issue.getIssueKey());
            kafkaProducerService.publishIssueEvent(IssueEvent.builder()
                    .issueId(issue.getId())
                    .issueKey(issue.getIssueKey())
                    .action("OVERDUE")
                    .triggeredByEmail("system")
                    .timestamp(LocalDateTime.now())
                    .message("Issue is overdue")
                    .build());
        }
        log.info("Completed scheduled job: checkOverdueIssues, found {} overdue issues.", overdueIssues.size());
    }
}
