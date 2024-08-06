package com.moonmovie.movie_service.exceptions;

import com.moonmovie.movie_service.responses.ErrorResponse;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ControllerAdvice;
import org.springframework.web.bind.annotation.ExceptionHandler;

@ControllerAdvice
public class HandleUserException {
    @ExceptionHandler(MovieException.class)
    public ResponseEntity<ErrorResponse> handleUserException(MovieException userException) {
        return ResponseEntity.status(userException.getHttpStatusCode()).body(new ErrorResponse(userException.getHttpStatusCode(), userException.getMessage()));
    }
}
