package com.moonmovie.movie_service.controllers;


import com.moonmovie.movie_service.kafka.KafkaProducerService;
import com.moonmovie.movie_service.requests.ChoosingSeatRequest;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.stereotype.Controller;

@Controller
public class WebsocketController {
    @Autowired
    private KafkaProducerService kafkaProducerService;

    @MessageMapping("/choosing-seat-ws")
//    @SendTo("/topic/seat-state")
    public void choosingSeat(ChoosingSeatRequest request) {
        System.out.println(request);
        kafkaProducerService.sendSeatDetailInfo(request);
    }
}
