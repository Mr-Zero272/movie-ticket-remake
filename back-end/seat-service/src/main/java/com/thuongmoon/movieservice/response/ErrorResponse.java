package com.thuongmoon.movieservice.response;

import com.thuongmoon.movieservice.constants.SeatErrorConstants;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class ErrorResponse {
    private int httpStatusCode;
    private String message;

    public ErrorResponse(SeatErrorConstants seatErrorConstants) {
        this.httpStatusCode = seatErrorConstants.httpStatusCode;
        this.message = seatErrorConstants.message;
    }
}
