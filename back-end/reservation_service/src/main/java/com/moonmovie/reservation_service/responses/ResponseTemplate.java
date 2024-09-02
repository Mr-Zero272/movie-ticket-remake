package com.moonmovie.reservation_service.responses;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;

@Data
@Builder
@AllArgsConstructor
public class ResponseTemplate {
    private String message;
}
