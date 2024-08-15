package com.moonmovie.movie_service.kafka;

import com.moonmovie.movie_service.requests.GenerateSeatDetailRequest;
import org.springframework.kafka.core.KafkaTemplate;
import org.springframework.stereotype.Service;

@Service
public class KafkaProducerService {

    private final KafkaTemplate<String, KafkaMessage<GenerateSeatDetailRequest>> kafkaTemplate;

    public KafkaProducerService(KafkaTemplate<String, KafkaMessage<GenerateSeatDetailRequest>> kafkaTemplate) {
        this.kafkaTemplate = kafkaTemplate;
    }

    public void sendMessageGenerateSeatDetail(String topic, KafkaMessage<GenerateSeatDetailRequest> message) {
        kafkaTemplate.send(topic, message);
    }
}
