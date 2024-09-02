package com.moonmovie.reservation_service.exceptions;

import com.moonmovie.reservation_service.responses.ErrorResponse;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ControllerAdvice;
import org.springframework.web.bind.annotation.ExceptionHandler;

@ControllerAdvice
public class HandleUserException {
    @ExceptionHandler(ReservationException.class)
    public ResponseEntity<ErrorResponse> handleUserException(ReservationException userException) {
        return ResponseEntity.status(userException.getHttpStatusCode()).body(new ErrorResponse(userException.getHttpStatusCode(), userException.getMessage()));
    }
}
