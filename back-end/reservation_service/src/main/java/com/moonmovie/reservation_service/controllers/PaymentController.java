package com.moonmovie.reservation_service.controllers;

import com.moonmovie.reservation_service.models.Payment;
import com.moonmovie.reservation_service.requests.PaymentMethodRequest;
import com.moonmovie.reservation_service.requests.PaymentRequest;
import com.moonmovie.reservation_service.responses.PaymentMethodResponse;
import com.moonmovie.reservation_service.services.PaymentService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.io.IOException;

@RestController
@RequestMapping("api/v2/moon-movie/reservation/payment")
public class PaymentController {

    @Autowired
    private PaymentService paymentService;

    @PostMapping
    public ResponseEntity<Payment> addNewPayment(@RequestBody PaymentRequest request) {
        return ResponseEntity.ok(paymentService.addPayment(request));
    }

    @PostMapping("/method")
    public ResponseEntity<PaymentMethodResponse> createPaymentByMethod(@RequestBody PaymentMethodRequest request) throws IOException {
        if (request.getMethod().equalsIgnoreCase("vnpay")) {
            return ResponseEntity.ok(paymentService.getPaymentForVnPay(request));
        } else {
            return ResponseEntity.ok(paymentService.getPaymentForZaloPay(request));
        }
    }
}
