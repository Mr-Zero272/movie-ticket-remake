package com.moonmovie.auth_service.exception;

import com.moonmovie.auth_service.response.ExceptionErrorResponse;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.HttpStatusCode;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.AuthenticationException;
import org.springframework.validation.FieldError;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ControllerAdvice;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.context.request.WebRequest;
import org.springframework.web.servlet.mvc.method.annotation.ResponseEntityExceptionHandler;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@ControllerAdvice
public class HandleException extends ResponseEntityExceptionHandler {
    @ExceptionHandler(GlobalException.class)
    public ResponseEntity<ExceptionErrorResponse> handleUserException(GlobalException globalException) {
        return ResponseEntity.status(globalException.getStatus()).body(new ExceptionErrorResponse(globalException.getStatus(), globalException.getMessage()));
    }

    @ExceptionHandler(AuthenticationException.class)
    public ResponseEntity<ExceptionErrorResponse> handleAuthenticationException() {
        return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(new ExceptionErrorResponse(400, "Username, email or password is incorrect"));
    }

    @Override
    protected ResponseEntity<Object> handleMethodArgumentNotValid(MethodArgumentNotValidException ex,
                                                                  HttpHeaders headers, HttpStatusCode status, WebRequest request) {
        Map<String, String> errors = new HashMap<>();
        List<String> generalErrors = new ArrayList<>();
        ex.getBindingResult().getAllErrors().forEach((error) -> {
            if (error instanceof FieldError fieldErr) {
                String fieldName = fieldErr.getField();
                String errorMessage = fieldErr.getDefaultMessage();
                errors.put(fieldName, errorMessage);
            } else {
                generalErrors.add(error.getDefaultMessage());
            }
        });

        HttpErrorResponse response = HttpErrorResponse.of("Unprocessable entity", 422, errors, generalErrors);

        return new ResponseEntity<>(response, HttpStatus.UNPROCESSABLE_ENTITY);
    }
}
