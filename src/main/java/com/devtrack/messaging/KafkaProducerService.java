package com.devtrack.messaging;

import com.devtrack.config.KafkaTopicConfig;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.kafka.core.KafkaTemplate;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
@Slf4j
public class KafkaProducerService {

    private final KafkaTemplate<String, Object> kafkaTemplate;

    public void publishIssueEvent(IssueEvent event) {
        log.info("Publishing issue event: {}", event);
        kafkaTemplate.send(KafkaTopicConfig.ISSUE_EVENTS_TOPIC, event.getIssueKey(), event);
    }
}
