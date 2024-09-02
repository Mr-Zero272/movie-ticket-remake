package com.moonmovie.reservation_service.responses;

import com.moonmovie.reservation_service.constants.ReservationErrorConstants;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class ErrorResponse {
    private int httpStatusCode;
    private String message;

    public ErrorResponse(ReservationErrorConstants reservationErrorConstants) {
        this.httpStatusCode = reservationErrorConstants.httpStatusCode;
        this.message = reservationErrorConstants.message;
    }
}
