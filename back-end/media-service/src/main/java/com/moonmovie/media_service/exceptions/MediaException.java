package com.moonmovie.media_service.exceptions;

import com.moonmovie.media_service.constants.MediaErrorConstants;
import lombok.Data;

import java.io.Serial;

@Data
public class MediaException extends RuntimeException {
    @Serial
    private static final long serialVersionUID = 1L;

    private int httpStatusCode;
    private String message;

    public MediaException(int httpStatusCode, String message) {
        this.httpStatusCode = httpStatusCode;
        this.message = message;
    }

    public MediaException(MediaErrorConstants mediaErrorConstants) {
        this.httpStatusCode = mediaErrorConstants.httpStatusCode;
        this.message = mediaErrorConstants.message;
    }
}
