package com.moonmovie.movie_service.constants;

public enum SeatErrorConstants {
    ERROR_AUDITORIUM_NAME_ALREADY_EXISTS(400, "This auditorium's name already exists"),
    ERROR_AUDITORIUM_NOT_EXISTS(400, "This auditorium not exists in the system."),
    ERROR_AUDITORIUM_ALREADY_EXISTS(400, "This auditorium already exists in the system.");
    public final int httpStatusCode;
    public final String message;
    private SeatErrorConstants(int httpStatusCode, String message) {
        this.httpStatusCode = httpStatusCode;
        this.message = message;
    }
}
