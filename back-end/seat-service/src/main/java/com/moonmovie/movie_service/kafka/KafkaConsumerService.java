package com.moonmovie.movie_service.kafka;

import com.moonmovie.movie_service.services.Impl.SeatDetailServiceImpl;
import lombok.extern.slf4j.Slf4j;
import org.springframework.kafka.annotation.KafkaListener;
import org.springframework.messaging.handler.annotation.Payload;
import org.springframework.stereotype.Service;

@Service
@Slf4j
public class KafkaConsumerService {

    private final SeatDetailServiceImpl seatDetailService;

    public KafkaConsumerService(SeatDetailServiceImpl seatDetailService) {
        this.seatDetailService = seatDetailService;
    }

    @KafkaListener(topics = "seat-generate", groupId = "moon-movie")
    public void listenOnSeatGenerateTopics(@Payload KafkaMessageGenerateSeatDetail message) {
        log.info("Event: " + message.getEvent());
        log.info("Timestamp: " + message.getTimestamp());
        seatDetailService.generateSeatDetails(message.getData());
    }
}
