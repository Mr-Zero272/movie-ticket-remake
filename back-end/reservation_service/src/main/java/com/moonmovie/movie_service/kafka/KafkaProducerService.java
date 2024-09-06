package com.moonmovie.movie_service.kafka;

import org.springframework.kafka.core.KafkaTemplate;
import org.springframework.kafka.support.KafkaHeaders;
import org.springframework.messaging.Message;
import org.springframework.messaging.support.MessageBuilder;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class KafkaProducerService {

    private final KafkaTemplate<String, List<String>> kafkaTemplate;

    public KafkaProducerService(KafkaTemplate<String, List<String>> kafkaTemplate) {
        this.kafkaTemplate = kafkaTemplate;
    }

    public void sendSeatDetailInfo(List<String> seatIds) {
        Message<List<String>> message = MessageBuilder
                .withPayload(seatIds)
                .setHeader(KafkaHeaders.TOPIC, "checkout_seat")
                .build();
        kafkaTemplate.send(message);
    }


}
