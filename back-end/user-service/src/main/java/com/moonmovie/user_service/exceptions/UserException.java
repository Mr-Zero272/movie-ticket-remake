package com.moonmovie.user_service.exceptions;

import com.moonmovie.user_service.constants.UserErrorConstants;
import com.moonmovie.user_service.response.ErrorResponse;
import lombok.Data;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ControllerAdvice;
import org.springframework.web.bind.annotation.ExceptionHandler;

@Data
public class UserException extends RuntimeException {
    private static final long serialVersionUID = 1L;

    private int httpStatusCode;
    private String message;

    public UserException(int httpStatusCode, String message) {
        this.httpStatusCode = httpStatusCode;
        this.message = message;
    }

    public UserException(UserErrorConstants userErrorConstants) {
        this.httpStatusCode = userErrorConstants.httpStatusCode;
        this.message = userErrorConstants.message;
    }
}
