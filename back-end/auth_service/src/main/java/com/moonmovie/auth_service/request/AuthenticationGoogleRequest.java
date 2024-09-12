package com.moonmovie.auth_service.request;

import jakarta.validation.constraints.NotNull;
import lombok.Data;

@Data
public class AuthenticationGoogleRequest {
    @NotNull
    String code;
    @NotNull
    private boolean keepLogin;
}
