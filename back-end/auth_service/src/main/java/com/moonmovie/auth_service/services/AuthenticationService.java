package com.moonmovie.auth_service.services;

import com.moonmovie.auth_service.models.Role;
import com.moonmovie.auth_service.request.AuthenticateOtpCodeRequest;
import com.moonmovie.auth_service.request.AuthenticationRequest;
import com.moonmovie.auth_service.request.ChangePasswordRequest;
import com.moonmovie.auth_service.request.RegisterRequest;
import com.moonmovie.auth_service.response.AuthenticationResponse;
import com.moonmovie.auth_service.response.ResponseTemplate;
import org.springframework.web.bind.MethodArgumentNotValidException;

import java.io.UnsupportedEncodingException;

public interface AuthenticationService {
    AuthenticationResponse register(RegisterRequest request, Role role) throws MethodArgumentNotValidException;
    AuthenticationResponse authenticateWithGoogle(String code, String redirectUrl) throws UnsupportedEncodingException;
    AuthenticationResponse authenticate(AuthenticationRequest request);
    ResponseTemplate sendOtpChangePassCode(String email);

    ResponseTemplate validCodeChangePass(AuthenticateOtpCodeRequest request);

    ResponseTemplate changePassword(ChangePasswordRequest request);
}
