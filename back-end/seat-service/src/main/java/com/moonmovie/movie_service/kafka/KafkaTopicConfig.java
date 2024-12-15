package com.moonmovie.movie_service.kafka;


import org.apache.kafka.clients.admin.NewTopic;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.kafka.config.TopicBuilder;

@Configuration
public class KafkaTopicConfig {
    @Bean
    public NewTopic choosingSeatTopic() {
        return TopicBuilder.name("choosing_seat")
                .build();
    }

    @Bean
    public NewTopic refreshSeatTopic() {
        return TopicBuilder.name("refresh_seat")
                .build();
    }

    @Bean
    public NewTopic changePositionSeatTopic() {
        return TopicBuilder.name("change_position_seat")
                .build();
    }
}
