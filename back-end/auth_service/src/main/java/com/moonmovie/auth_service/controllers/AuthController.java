package com.moonmovie.auth_service.controllers;

import com.moonmovie.auth_service.models.Role;
import com.moonmovie.auth_service.request.AuthenticationGoogleRequest;
import com.moonmovie.auth_service.request.AuthenticationRequest;
import com.moonmovie.auth_service.request.RegisterRequest;
import com.moonmovie.auth_service.response.AuthenticationResponse;
import com.moonmovie.auth_service.services.AuthenticationService;
import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletResponse;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.io.UnsupportedEncodingException;

@RestController
@RequestMapping("/api/v2/moon-movie/auth")
public class AuthController {
    @Autowired
    private AuthenticationService authenticationService;

    @PostMapping("/register")
    public ResponseEntity<AuthenticationResponse> register(@Valid @RequestBody RegisterRequest request) throws MethodArgumentNotValidException {
        return ResponseEntity.ok(authenticationService.register(request, Role.USER));
    }

    @PostMapping("/authenticate")
    public ResponseEntity<AuthenticationResponse> authenticate(@Valid @RequestBody AuthenticationRequest request, HttpServletResponse response){
        AuthenticationResponse authenticationResponse = authenticationService.authenticate(request);
        Cookie tokenCookie = new Cookie("mmtk", authenticationResponse.getToken());
        tokenCookie.setPath("/");
        if (request.isKeepLogin()) {
            tokenCookie.setMaxAge(3600);
        }
        tokenCookie.setHttpOnly(true);
        tokenCookie.setSecure(false);

        String cookieHeader = tokenCookie.getName() + "=" + tokenCookie.getValue()
                + "; Path=" + tokenCookie.getPath()
                + "; HttpOnly; SameSite=Lax";


//        Cookie refreshTokenCookie = new Cookie("mmrtk", authenticationResponse.getRefreshToken());
//        refreshTokenCookie.setPath("/");
//        if (request.isKeepLogin()) {
//            refreshTokenCookie.setMaxAge(3600);
//        }
//        refreshTokenCookie.setHttpOnly(true);
//        refreshTokenCookie.setSecure(false);

        response.addHeader("Set-Cookie", cookieHeader);
//        response.addCookie(refreshTokenCookie);
        return ResponseEntity.ok(authenticationService.authenticate(request));
    }

    @PostMapping("/authenticate/google")
    public ResponseEntity<AuthenticationResponse> loginWithGoogle(@RequestBody AuthenticationGoogleRequest request) throws UnsupportedEncodingException {
        return ResponseEntity.ok(authenticationService.authenticateWithGoogle(request.getCode()));
    }
}
