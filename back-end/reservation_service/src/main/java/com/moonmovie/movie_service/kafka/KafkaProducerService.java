package com.moonmovie.movie_service.kafka;

import com.moonmovie.movie_service.requests.CheckoutSeatsRequest;
import org.springframework.kafka.core.KafkaTemplate;
import org.springframework.kafka.support.KafkaHeaders;
import org.springframework.messaging.Message;
import org.springframework.messaging.support.MessageBuilder;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class KafkaProducerService {

    private final KafkaTemplate<String, Object> kafkaTemplate;

    public KafkaProducerService(KafkaTemplate<String, Object> kafkaTemplate) {
        this.kafkaTemplate = kafkaTemplate;
    }

    public void sendSeatDetailInfo(List<String> seatIds, String customerId) {
        CheckoutSeatsRequest checkoutSeatsRequest = new CheckoutSeatsRequest();
        checkoutSeatsRequest.setCustomerId(customerId);
        checkoutSeatsRequest.setSeatIds(seatIds);
        Message<CheckoutSeatsRequest> message = MessageBuilder
                .withPayload(checkoutSeatsRequest)
                .setHeader(KafkaHeaders.TOPIC, "checkout_seat")
                .build();
        kafkaTemplate.send(message);
    }

    public void sendRefreshSeatsInfo(List<String> seatIds) {
        Message<List<String>> message = MessageBuilder
                .withPayload(seatIds)
                .setHeader(KafkaHeaders.TOPIC, "refresh_seat")
                .build();
        kafkaTemplate.send(message);
    }

}
