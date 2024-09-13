package com.moonmovie.auth_service.services.Impl;

import com.google.gson.Gson;
import com.google.gson.JsonObject;
import com.google.gson.JsonParser;
import com.moonmovie.auth_service.dao.UserDao;
import com.moonmovie.auth_service.exception.GlobalException;
import com.moonmovie.auth_service.jwt.JwtService;
import com.moonmovie.auth_service.models.Authentication;
import com.moonmovie.auth_service.models.Role;
import com.moonmovie.auth_service.models.User;
import com.moonmovie.auth_service.request.AuthenticationRequest;
import com.moonmovie.auth_service.request.RegisterRequest;
import com.moonmovie.auth_service.response.AuthenticationResponse;
import com.moonmovie.auth_service.services.AuthenticationService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.*;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.util.LinkedMultiValueMap;
import org.springframework.util.MultiValueMap;
import org.springframework.validation.BeanPropertyBindingResult;
import org.springframework.validation.BindingResult;
import org.springframework.validation.FieldError;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.client.RestTemplate;

import java.io.UnsupportedEncodingException;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Service
public class AuthenticationServiceImpl implements AuthenticationService {
    @Autowired
    private UserDao userDao;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Autowired
    private JwtService jwtService;

    @Autowired
    private AuthenticationManager authenticationManager;

    @Value("${app.local.variable.client_id}")
    private String clientGoogleId;

    @Value("${app.local.variable.client_secret}")
    private String clientGoogleSecret;

    private MethodArgumentNotValidException createMethodArgumentNotValidException(String field, String message) {
        FieldError fieldError = new FieldError("user", field, message);
        BindingResult bindingResult = new BeanPropertyBindingResult(new Object(), "user");
        bindingResult.addError(fieldError);
        return new MethodArgumentNotValidException(null, bindingResult);
    }

    @Override
    public AuthenticationResponse register(RegisterRequest request, Role role) throws MethodArgumentNotValidException {
        Optional<User> userInDb = userDao.findByEmail(request.getEmail());
        if (userInDb.isPresent()) {
            if (userInDb.get().getAuthentications().size() == 2) {
                throw createMethodArgumentNotValidException("email", "This email is already in use!");
            } else {
                if (userInDb.get().getAuthentications().get(0).getProvider().equalsIgnoreCase("local")) {
                    throw createMethodArgumentNotValidException("email", "This email is already in use!");
                }

                if (userDao.countByUsername(request.getUsername()) == 1) {
                    throw createMethodArgumentNotValidException("username", "This username is already in use!");
                }

                Authentication localAuthentication = Authentication.builder()
                        .password(passwordEncoder.encode(request.getPassword()))
                        .provider("local")
                        .createdAt(LocalDateTime.now())
                        .modifiedAt(LocalDateTime.now())
                        .build();
                userInDb.get().getAuthentications().add(localAuthentication);
                String token = jwtService.generateToken(userInDb.get(), 7);
                String refreshToken = jwtService.generateToken(userInDb.get(), 9);
                userDao.save(userInDb.get());
                return AuthenticationResponse.builder()
                        .token(token)
                        .refreshToken(refreshToken)
                        .message("Register new user successfully!")
                        .build();

            }
        } else {
            if (userDao.countByUsername(request.getUsername()) == 1) {
                throw createMethodArgumentNotValidException("username", "This username is already in use!");
            }

            Authentication localAuthentication = Authentication.builder()
                    .password(passwordEncoder.encode(request.getPassword()))
                    .provider("local")
                    .createdAt(LocalDateTime.now())
                    .modifiedAt(LocalDateTime.now())
                    .build();

            User user = User.builder()
                    .username(request.getUsername())
                    .email(request.getEmail())
                    .onboarded(true)
                    .modifiedAt(LocalDateTime.now())
                    .createdAt(LocalDateTime.now())
                    .role(role)
                    .authentications(List.of(localAuthentication))
                    .build();
            String token = jwtService.generateToken(user, 7);
            String refreshToken = jwtService.generateToken(user, 9);
            userDao.save(user);
            return AuthenticationResponse.builder()
                    .token(token)
                    .refreshToken(refreshToken)
                    .message("Register new user successfully!")
                    .build();
        }
    }

    @Override
    public AuthenticationResponse authenticateWithGoogle(String code) throws UnsupportedEncodingException {
        String accessGoogleToken = getOauthAccessTokenGoogle(code);
        User tempUserInfo = getProfileDetailsGoogle(accessGoogleToken);
        Optional<User> userInDatabase = userDao.findByEmail(tempUserInfo.getEmail());

        // data return;
        String token = "";
        String refreshToken = "";

        if (userInDatabase.isPresent()) {
            userInDatabase.get().setEmail(tempUserInfo.getEmail());
            userInDatabase.get().setName(tempUserInfo.getName());
            userInDatabase.get().setAvatar(tempUserInfo.getAvatar());
            User upToDateUserInfo = userDao.save(userInDatabase.get());
            if (upToDateUserInfo.getAuthentications().size() == 2) {
                token = jwtService.generateToken(upToDateUserInfo, 7);
                refreshToken = jwtService.generateToken(upToDateUserInfo, 9);
                return AuthenticationResponse.builder()
                        .token(token)
                        .refreshToken(refreshToken)
                        .message("Sign in successfully!")
                        .build();
            } else {
                if (upToDateUserInfo.getAuthentications().get(0).getProvider().equalsIgnoreCase("google")) {
                    token = jwtService.generateToken(upToDateUserInfo, 7);
                    refreshToken = jwtService.generateToken(upToDateUserInfo, 9);
                    return AuthenticationResponse.builder()
                            .token(token)
                            .refreshToken(refreshToken)
                            .message("Sign in successfully!")
                            .build();
                } else {
                    Authentication googleAuthentication = Authentication.builder()
                            .password(null)
                            .provider("google")
                            .createdAt(LocalDateTime.now())
                            .modifiedAt(LocalDateTime.now())
                            .build();
                    upToDateUserInfo.getAuthentications().add(googleAuthentication);
                    userDao.save(upToDateUserInfo);
                    token = jwtService.generateToken(upToDateUserInfo, 7);
                    refreshToken = jwtService.generateToken(upToDateUserInfo, 9);
                    return AuthenticationResponse.builder()
                            .token(token)
                            .refreshToken(refreshToken)
                            .message("Sign in successfully!")
                            .build();
                }
            }
        } else {
            Authentication googleAuthentication = Authentication.builder()
                    .password(null)
                    .provider("google")
                    .createdAt(LocalDateTime.now())
                    .modifiedAt(LocalDateTime.now())
                    .build();
            User newUser = User.builder()
                    .username("")
                    .email(tempUserInfo.getEmail())
                    .name(tempUserInfo.getName())
                    .bio("")
                    .avatar(tempUserInfo.getAvatar())
                    .onboarded(false)
                    .createdAt(LocalDateTime.now())
                    .modifiedAt(LocalDateTime.now())
                    .authentications(List.of(googleAuthentication))
                    .role(Role.USER)
                    .build();

            User savedUser = userDao.save(newUser);
            token = jwtService.generateToken(savedUser, 7);
            refreshToken = jwtService.generateToken(savedUser, 9);

            return AuthenticationResponse.builder()
                    .token(token)
                    .refreshToken(refreshToken)
                    .message("Sign in successfully!")
                    .build();
        }
    }

    public String getOauthAccessTokenGoogle(String code) {
        RestTemplate restTemplate = new RestTemplate();
        HttpHeaders httpHeaders = new HttpHeaders();
        httpHeaders.setContentType(MediaType.APPLICATION_FORM_URLENCODED);

        MultiValueMap<String, String> params = new LinkedMultiValueMap<>();
        params.add("code", code);
        params.add("redirect_uri", "http://localhost:3000/sign-in");
        params.add("client_id", clientGoogleId);
        params.add("client_secret", clientGoogleSecret);
        params.add("scope", "https%3A%2F%2Fwww.googleapis.com%2Fauth%2Fuserinfo.profile");
        params.add("scope", "https%3A%2F%2Fwww.googleapis.com%2Fauth%2Fuserinfo.email");
        params.add("scope", "openid");
        params.add("grant_type", "authorization_code");

        HttpEntity<MultiValueMap<String, String>> requestEntity = new HttpEntity<>(params, httpHeaders);

        String url = "https://accounts.google.com/o/oauth2/token";
        String response = restTemplate.postForObject(url, requestEntity, String.class);
        JsonObject jsonObject = JsonParser.parseString(response).getAsJsonObject();
        return jsonObject.get("access_token").toString();
    }

    public User getProfileDetailsGoogle(String accessToken) throws UnsupportedEncodingException {
        RestTemplate restTemplate = new RestTemplate();
        HttpHeaders httpHeaders = new HttpHeaders();
        httpHeaders.setBearerAuth(accessToken);

        HttpEntity<String> requestEntity = new HttpEntity<>(httpHeaders);

        String url = "https://www.googleapis.com/oauth2/v2/userinfo";
        ResponseEntity<String> response = restTemplate.exchange(url, HttpMethod.GET, requestEntity, String.class);
        JsonObject jsonObject = new Gson().fromJson(response.getBody(), JsonObject.class);
        User user = User.builder()
                .email(jsonObject.get("email").getAsString())
                .name(jsonObject.get("name").getAsString())
                .avatar(jsonObject.get("picture").getAsString())
                .build();
        return user;
    }

    @Override
    public AuthenticationResponse authenticate(AuthenticationRequest request) {
        authenticationManager
                .authenticate(new UsernamePasswordAuthenticationToken(request.getUsernameOrEmail(), request.getPassword()));

        User user = userDao.findByEmail(request.getUsernameOrEmail())
                .orElseGet(() -> userDao.findByUsername(request.getUsernameOrEmail())
                        .orElseThrow(() -> new UsernameNotFoundException("User not found with email or username: " + request.getUsernameOrEmail())));
        String token = jwtService.generateToken(user, 7);
        String refreshToken = jwtService.generateToken(user, 9);
        userDao.save(user);
        return AuthenticationResponse.builder()
                .token(token)
                .refreshToken(refreshToken)
                .message("Sign in successfully!")
                .build();
    }
}
