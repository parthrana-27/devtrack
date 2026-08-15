package com.devtrack.messaging;

import com.devtrack.config.KafkaTopicConfig;
import lombok.extern.slf4j.Slf4j;
import org.springframework.kafka.annotation.KafkaListener;
import org.springframework.stereotype.Service;

@Service
@Slf4j
public class KafkaConsumerService {

    @KafkaListener(topics = KafkaTopicConfig.ISSUE_EVENTS_TOPIC, groupId = "notification-group")
    public void consumeIssueEvent(IssueEvent event) {
        log.info("Received issue event for notification: {}", event);
        // Additional logic to send email or in-app notification can be placed here
    }
}
