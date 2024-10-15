package com.moonmovie.movie_service.kafka;

import org.apache.kafka.clients.admin.NewTopic;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.kafka.config.TopicBuilder;

@Configuration
public class KafkaTopicConfig {

    @Bean
    public NewTopic seatGenerate() {
        return TopicBuilder.name("seat-generate")
                .build();
    }

    @Bean
    public NewTopic seatDelete() {
        return TopicBuilder.name("seat-delete")
                .build();
    }
}
