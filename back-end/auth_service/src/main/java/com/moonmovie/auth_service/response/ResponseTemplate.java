package com.moonmovie.auth_service.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;

@Data
@Builder
@AllArgsConstructor
public class ResponseTemplate {
    private int status;
    private String message;
}
