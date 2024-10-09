package com.moonmovie.auth_service.request;

import lombok.Data;

@Data
public class AuthenticateOtpCodeRequest {
    private String code;
    private String email;
}
