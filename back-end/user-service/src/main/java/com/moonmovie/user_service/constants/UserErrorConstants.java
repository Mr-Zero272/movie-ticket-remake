package com.moonmovie.user_service.constants;

public enum UserErrorConstants {
    ERROR_USER_NOT_FOUND(400, "This user does not exist in the system"),
    ERROR_USERNAME_EXISTS(400, "This username is existed in the system"),
    ERROR_UNABLE_TO_SAVE_USER(500, "Unable to save user");
    public final int httpStatusCode;
    public final String message;
    private UserErrorConstants(int httpStatusCode, String message) {
        this.httpStatusCode = httpStatusCode;
        this.message = message;
    }
}
