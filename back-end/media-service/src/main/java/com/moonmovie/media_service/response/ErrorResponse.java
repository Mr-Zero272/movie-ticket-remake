package com.moonmovie.media_service.response;

import com.moonmovie.media_service.constants.MediaErrorConstants;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class ErrorResponse {
    private int httpStatusCode;
    private String message;

    public ErrorResponse(MediaErrorConstants mediaErrorConstants) {
        this.httpStatusCode = mediaErrorConstants.httpStatusCode;
        this.message = mediaErrorConstants.message;
    }
}
