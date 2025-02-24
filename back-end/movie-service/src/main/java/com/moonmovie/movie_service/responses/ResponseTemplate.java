package com.moonmovie.movie_service.responses;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;

@Data
@Builder
@AllArgsConstructor
public class ResponseTemplate {
    private int httpStatusCode = 200;
    private String message;
}
