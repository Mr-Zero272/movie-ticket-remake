package com.moonmovie.media_service.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;

@Data
@Builder
@AllArgsConstructor
public class TemplateResponse {
    private int status;
    private String message;
}
