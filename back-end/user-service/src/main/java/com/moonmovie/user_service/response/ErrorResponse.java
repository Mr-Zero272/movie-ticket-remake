package com.moonmovie.user_service.response;

import com.moonmovie.user_service.constants.UserErrorConstants;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class ErrorResponse {
    private int httpStatusCode;
    private String message;

    public ErrorResponse(UserErrorConstants userErrorConstants) {
        this.httpStatusCode = userErrorConstants.httpStatusCode;
        this.message = userErrorConstants.message;
    }
}
