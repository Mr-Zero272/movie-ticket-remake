package com.thuongmoon.movieservice.exceptions;

import com.thuongmoon.movieservice.response.ErrorResponse;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ControllerAdvice;
import org.springframework.web.bind.annotation.ExceptionHandler;

@ControllerAdvice
public class HandleSeatException {
    @ExceptionHandler(SeatException.class)
    public ResponseEntity<ErrorResponse> handleUserException(SeatException seatException) {
        return ResponseEntity.status(seatException.getHttpStatusCode()).body(new ErrorResponse(seatException.getHttpStatusCode(), seatException.getMessage()));
    }
}
