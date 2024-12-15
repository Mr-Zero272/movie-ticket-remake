package com.moonmovie.movie_service.kafka;

import com.moonmovie.movie_service.requests.SeatDetailInfo;
import com.moonmovie.movie_service.services.TicketService;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.kafka.annotation.KafkaListener;
import org.springframework.messaging.handler.annotation.Payload;
import org.springframework.stereotype.Service;

@Service
@Slf4j
public class KafkaConsumerService {
    @Autowired
    private TicketService ticketService;

    @KafkaListener(topics = "change_position_seat",  groupId = "moon-movie")
    public void refreshSeat(@Payload SeatDetailInfo req) {
        log.info(String.format("Change position: -> %s", req.toString()));
        ticketService.updateSeatPosition(req);
    }
}
