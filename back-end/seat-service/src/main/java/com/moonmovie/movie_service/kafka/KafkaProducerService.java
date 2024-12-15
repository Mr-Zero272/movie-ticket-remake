package com.moonmovie.movie_service.kafka;

import com.moonmovie.movie_service.requests.ChoosingSeatRequest;
import com.moonmovie.movie_service.requests.SeatDetailInfo;
import org.springframework.kafka.core.KafkaTemplate;
import org.springframework.kafka.support.KafkaHeaders;
import org.springframework.messaging.Message;
import org.springframework.messaging.support.MessageBuilder;
import org.springframework.stereotype.Service;

@Service
public class KafkaProducerService {

    private final KafkaTemplate<String, Object> kafkaTemplate;

    public KafkaProducerService(KafkaTemplate<String, Object> kafkaTemplate) {
        this.kafkaTemplate = kafkaTemplate;
    }

    public void sendSeatDetailInfo(ChoosingSeatRequest request) {
        Message<ChoosingSeatRequest> message = MessageBuilder
                .withPayload(request)
                .setHeader(KafkaHeaders.TOPIC, "choosing_seat")
                .build();
        kafkaTemplate.send(message);
    }

    public void sendUpdatePositionSeatInfo(SeatDetailInfo request) {
        Message<SeatDetailInfo> message = MessageBuilder
                .withPayload(request)
                .setHeader(KafkaHeaders.TOPIC, "change_position_seat")
                .build();
        kafkaTemplate.send(message);
    }


}
