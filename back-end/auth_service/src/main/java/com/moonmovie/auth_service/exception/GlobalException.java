package com.moonmovie.auth_service.exception;

import lombok.Data;

@Data
public class GlobalException extends RuntimeException {
    private static final long serialVersionUID = 1L;

    private final int status;
    private final String message;

    public GlobalException(int status, String message) {
        this.status = status;
        this.message = message;
    }
}
