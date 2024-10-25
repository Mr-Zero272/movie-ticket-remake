package com.moonmovie.auth_service.request;

import jakarta.validation.constraints.NotNull;
import lombok.Data;

@Data
public class AuthenticationRequest {
    @NotNull
    private String usernameOrEmail;
    @NotNull
    private String password;
    @NotNull
    private boolean keepLogin;
}
