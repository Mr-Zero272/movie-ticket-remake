package com.moonmovie.auth_service.services;

import com.moonmovie.auth_service.models.Role;
import com.moonmovie.auth_service.request.AuthenticationRequest;
import com.moonmovie.auth_service.request.RegisterRequest;
import com.moonmovie.auth_service.response.AuthenticationResponse;
import org.springframework.web.bind.MethodArgumentNotValidException;

import java.io.UnsupportedEncodingException;

public interface AuthenticationService {
    AuthenticationResponse register(RegisterRequest request, Role role) throws MethodArgumentNotValidException;
    AuthenticationResponse authenticateWithGoogle(String code) throws UnsupportedEncodingException;
    AuthenticationResponse authenticate(AuthenticationRequest request);
}
