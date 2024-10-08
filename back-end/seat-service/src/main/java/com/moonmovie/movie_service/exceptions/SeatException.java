package com.moonmovie.movie_service.exceptions;

import com.moonmovie.movie_service.constants.SeatErrorConstants;
import lombok.Data;

@Data
public class SeatException extends RuntimeException {
    private static final long serialVersionUID = 1L;

    private int httpStatusCode;
    private String message;

    public SeatException(int httpStatusCode, String message) {
        this.httpStatusCode = httpStatusCode;
        this.message = message;
    }

    public SeatException(SeatErrorConstants seatErrorConstants) {
        this.httpStatusCode = seatErrorConstants.httpStatusCode;
        this.message = seatErrorConstants.message;
    }
}
