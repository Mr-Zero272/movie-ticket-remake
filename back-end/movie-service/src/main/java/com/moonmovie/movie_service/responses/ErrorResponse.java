package com.moonmovie.movie_service.responses;

import com.moonmovie.movie_service.constants.MovieErrorConstants;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class ErrorResponse {
    private int httpStatusCode;
    private String message;

    public ErrorResponse(MovieErrorConstants movieErrorConstants) {
        this.httpStatusCode = movieErrorConstants.httpStatusCode;
        this.message = movieErrorConstants.message;
    }
}
