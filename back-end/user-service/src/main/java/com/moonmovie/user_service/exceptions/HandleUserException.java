package com.moonmovie.user_service.exceptions;

import com.moonmovie.user_service.response.ErrorResponse;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ControllerAdvice;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.multipart.MaxUploadSizeExceededException;

@ControllerAdvice
public class HandleUserException {
    @ExceptionHandler(UserException.class)
    public ResponseEntity<ErrorResponse> handleUserException(UserException userException) {
        return ResponseEntity.status(userException.getHttpStatusCode()).body(new ErrorResponse(userException.getHttpStatusCode(), userException.getMessage()));
    }
}
