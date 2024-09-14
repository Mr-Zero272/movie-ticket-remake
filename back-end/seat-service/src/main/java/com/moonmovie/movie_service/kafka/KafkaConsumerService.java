package com.moonmovie.movie_service.kafka;

import com.moonmovie.movie_service.requests.ChoosingSeatRequest;
import com.moonmovie.movie_service.services.Impl.SeatDetailServiceImpl;
import lombok.extern.slf4j.Slf4j;
import org.springframework.kafka.annotation.KafkaListener;
import org.springframework.messaging.handler.annotation.Payload;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@Slf4j
public class KafkaConsumerService {

    private final SeatDetailServiceImpl seatDetailService;

    public KafkaConsumerService(SeatDetailServiceImpl seatDetailService) {
        this.seatDetailService = seatDetailService;
    }

    @KafkaListener(topics = "seat-generate", groupId = "moon-movie")
    public void listenOnSeatGenerateTopics(@Payload KafkaMessage message) {
        log.info("Event: " + message.getEvent());
        log.info("Timestamp: " + message.getTimestamp());
        seatDetailService.generateSeatDetails(message.getData());
    }

    @KafkaListener(topics = "choosing_seat",  groupId = "moon-movie")
    public void consumeSeat(@Payload ChoosingSeatRequest seatStatus) {
        log.info(String.format("Received: -> %s", seatStatus.toString()));
        seatDetailService.updateSeatStatus(seatStatus);
    }

    @KafkaListener(topics = "checkout_seat",  groupId = "moon-movie")
    public void checkoutSeat(@Payload List<String> seatIds) {
        log.info(String.format("Received list seatId: -> %s", seatIds.toString()));
        seatDetailService.checkoutSeat(seatIds);
    }
}
