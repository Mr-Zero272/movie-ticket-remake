package com.moonmovie.movie_service.constants;

public enum MovieErrorConstants {
    ERROR_MOVIE_EXISTED(400, "This movie already existed."),
    ERROR_MAX_SHOWINGS_THIS_MONTH(400, "This month has reached its maximum number of screenings.");
    public final int httpStatusCode;
    public final String message;
    private MovieErrorConstants(int httpStatusCode, String message) {
        this.httpStatusCode = httpStatusCode;
        this.message = message;
    }
}
