package com.moonmovie.movie_service.responses;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class ExceptionErrorResponse {
    private int status;
    private String message;
}
