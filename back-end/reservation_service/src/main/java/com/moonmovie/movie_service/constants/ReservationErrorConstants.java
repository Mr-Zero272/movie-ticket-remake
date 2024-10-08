package com.moonmovie.movie_service.constants;

public enum ReservationErrorConstants {
    ERROR_NOT_EXIST_FILTER_TICKET(400, "This filter is invalid"),
    ERROR_NO_SEAT_TO_CHECKOUT(400, "No seats have been selected!"),
    ERROR_UNABLE_TO_COMMUNICATE_WITH_OTHER_SERVICE(500, "Cannot communicate with other service"),
    ERROR_ORDER_NOT_EXIST(409, "This order does not exist in the system."),
    ERROR_TICKET_NOT_EXIST(409, "This ticket does not exist in the system.");
    public final int httpStatusCode;
    public final String message;
    private ReservationErrorConstants(int httpStatusCode, String message) {
        this.httpStatusCode = httpStatusCode;
        this.message = message;
    }
}
