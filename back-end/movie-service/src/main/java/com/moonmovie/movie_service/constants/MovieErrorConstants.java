package com.moonmovie.movie_service.constants;

public enum MovieErrorConstants {
    ERROR_SHOWING_NOT_EXISTS(400, "This showing does not exists"),
    ERROR_SEAT_SERVICE_NOT_AVAILABLE(500, "Seat service is not available"),
    ERROR_MOVIE_NOT_EXISTS(400, "This movie does not exists."),
    ERROR_THIS_MONTH_WAS_SCHEDULED(400, "This month was scheduled."),
    ERROR_DO_NOT_HAVE_PERMISSION(400, "You do not have permission to do this action"),
    ERROR_MOVIE_EXISTED(409, "This movie already existed."),
    ERROR_MAX_SHOWINGS_THIS_MONTH(400, "This month has reached its maximum number of screenings.");
    public final int httpStatusCode;
    public final String message;
    private MovieErrorConstants(int httpStatusCode, String message) {
        this.httpStatusCode = httpStatusCode;
        this.message = message;
    }
}
