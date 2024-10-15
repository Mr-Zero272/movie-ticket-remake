package com.moonmovie.movie_service.kafka;

import lombok.Builder;
import lombok.Data;

import java.time.LocalDateTime;

@Data
@Builder
public class KafkaMessage<T> {
    private String event;
    private LocalDateTime timestamp;
    private T data;
}
