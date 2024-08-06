package com.moonmovie.media_service.exceptions;

import com.moonmovie.media_service.response.ErrorResponse;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ControllerAdvice;
import org.springframework.web.bind.annotation.ExceptionHandler;

@ControllerAdvice
public class HandleUserException {
    @ExceptionHandler(MediaException.class)
    public ResponseEntity<ErrorResponse> handleUserException(MediaException userException) {
        return ResponseEntity.status(userException.getHttpStatusCode()).body(new ErrorResponse(userException.getHttpStatusCode(), userException.getMessage()));
    }
}
