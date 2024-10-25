package com.moonmovie.auth_service.request;

import jakarta.validation.constraints.NotNull;
import lombok.Data;

@Data
public class AuthenticationGoogleRequest {
    @NotNull
    private String redirectUri;
    @NotNull
    private String code;
    @NotNull
    private boolean keepLogin;
}
