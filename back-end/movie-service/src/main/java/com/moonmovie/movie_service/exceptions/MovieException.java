package com.moonmovie.movie_service.exceptions;

import com.moonmovie.movie_service.constants.MovieErrorConstants;
import lombok.Data;

@Data
public class MovieException extends RuntimeException {
    private static final long serialVersionUID = 1L;

    private int httpStatusCode;
    private String message;

    public MovieException(int httpStatusCode, String message) {
        this.httpStatusCode = httpStatusCode;
        this.message = message;
    }

    public MovieException(MovieErrorConstants movieErrorConstants) {
        this.httpStatusCode = movieErrorConstants.httpStatusCode;
        this.message = movieErrorConstants.message;
    }
}
