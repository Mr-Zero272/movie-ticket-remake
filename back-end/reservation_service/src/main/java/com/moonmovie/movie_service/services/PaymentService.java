package com.moonmovie.movie_service.services;

import com.moonmovie.movie_service.models.Payment;
import com.moonmovie.movie_service.requests.PaymentMethodRequest;
import com.moonmovie.movie_service.requests.PaymentRequest;
import com.moonmovie.movie_service.responses.PaymentMethodResponse;

import java.io.IOException;
import java.io.UnsupportedEncodingException;

public interface PaymentService {
    public Payment addPayment(PaymentRequest request);

    public PaymentMethodResponse getPaymentForVnPay(PaymentMethodRequest request) throws UnsupportedEncodingException;
    public PaymentMethodResponse getPaymentForZaloPay(PaymentMethodRequest request) throws IOException;
}
