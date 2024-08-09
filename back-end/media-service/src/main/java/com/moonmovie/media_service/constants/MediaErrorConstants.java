package com.moonmovie.media_service.constants;

public enum MediaErrorConstants {
    ERROR_UNABLE_TO_ENCODE_ULR(500, "Unable to encode this url."),
    ERROR_FILE_EXISTED(400, "This file is already existed."),
    ERROR_UNABLE_TO_LOAD_VIDEO(500, "Unable to load video."),
    ERROR_UNABLE_TO_LOAD_IMAGE(500, "Unable to load image.");
    public final int httpStatusCode;
    public final String message;
    private MediaErrorConstants(int httpStatusCode, String message) {
        this.httpStatusCode = httpStatusCode;
        this.message = message;
    }
}
