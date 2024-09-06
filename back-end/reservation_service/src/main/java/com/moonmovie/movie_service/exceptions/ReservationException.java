package com.moonmovie.movie_service.exceptions;

import com.moonmovie.movie_service.constants.ReservationErrorConstants;
import lombok.Data;

@Data
public class ReservationException extends RuntimeException {
    private static final long serialVersionUID = 1L;

    private int httpStatusCode;
    private String message;

    public ReservationException(int httpStatusCode, String message) {
        this.httpStatusCode = httpStatusCode;
        this.message = message;
    }

    public ReservationException(ReservationErrorConstants reservationErrorConstant) {
        this.httpStatusCode = reservationErrorConstant.httpStatusCode;
        this.message = reservationErrorConstant.message;
    }
}
