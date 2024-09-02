package com.moonmovie.reservation_service.constants;

public enum ReservationErrorConstants {
    ERROR_TICKET_NOT_EXIST(409, "This movie does not exist.");
    public final int httpStatusCode;
    public final String message;
    private ReservationErrorConstants(int httpStatusCode, String message) {
        this.httpStatusCode = httpStatusCode;
        this.message = message;
    }
}
