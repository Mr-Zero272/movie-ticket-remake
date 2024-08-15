package com.moonmovie.movie_service.kafka;

import com.moonmovie.movie_service.requests.GenerateSeatDetailRequest;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class KafkaMessageGenerateSeatDetail {
    private String event;
    private LocalDateTime timestamp;
    private GenerateSeatDetailRequest data;
}
