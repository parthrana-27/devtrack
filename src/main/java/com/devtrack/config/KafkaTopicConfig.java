package com.devtrack.config;

import org.apache.kafka.clients.admin.NewTopic;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.kafka.config.TopicBuilder;

@Configuration
public class KafkaTopicConfig {

    public static final String ISSUE_EVENTS_TOPIC = "issue-events";

    @Bean
    public NewTopic issueEventsTopic() {
        return TopicBuilder.name(ISSUE_EVENTS_TOPIC)
                .partitions(3)
                .replicas(1)
                .build();
    }
}
