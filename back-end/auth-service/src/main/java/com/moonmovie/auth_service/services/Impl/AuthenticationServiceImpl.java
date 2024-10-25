package com.moonmovie.auth_service.services.Impl;

import com.google.gson.Gson;
import com.google.gson.JsonObject;
import com.google.gson.JsonParser;
import com.moonmovie.auth_service.dao.UserDao;
import com.moonmovie.auth_service.jwt.JwtService;
import com.moonmovie.auth_service.models.Authentication;
import com.moonmovie.auth_service.models.Role;
import com.moonmovie.auth_service.models.User;
import com.moonmovie.auth_service.request.AuthenticateOtpCodeRequest;
import com.moonmovie.auth_service.request.AuthenticationRequest;
import com.moonmovie.auth_service.request.ChangePasswordRequest;
import com.moonmovie.auth_service.request.RegisterRequest;
import com.moonmovie.auth_service.response.AuthenticationResponse;
import com.moonmovie.auth_service.response.ResponseTemplate;
import com.moonmovie.auth_service.services.AuthenticationService;
import com.moonmovie.auth_service.services.MailService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.core.env.Environment;
import org.springframework.data.redis.core.StringRedisTemplate;
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
import org.thymeleaf.context.Context;

import java.io.UnsupportedEncodingException;
import java.security.SecureRandom;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;
import java.util.concurrent.TimeUnit;

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

    @Autowired
    private MailService mailService;

    @Autowired
    private StringRedisTemplate redisTemplate;

    @Autowired
    private Environment environment;

    private static final String OTP_CHARACTERS = "0123456789";

    private MethodArgumentNotValidException createMethodArgumentNotValidException(String field, String message) {
        return createMethodArgumentNotValidException(field, message, "user");
    }

    private MethodArgumentNotValidException createMethodArgumentNotValidException(String field, String message, String objectName) {
        FieldError fieldError = new FieldError(objectName, field, message);
        BindingResult bindingResult = new BeanPropertyBindingResult(new Object(), objectName);
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

                if (!userInDb.get().getUsername().equalsIgnoreCase("")
                        && !userInDb.get().getUsername().equalsIgnoreCase(request.getUsername())
                        && userDao.countByUsername(request.getUsername()) == 1) {
                    throw createMethodArgumentNotValidException("username", "This username is already in use!");
                }

                Authentication localAuthentication = Authentication.builder()
                        .password(passwordEncoder.encode(request.getPassword()))
                        .provider("local")
                        .createdAt(LocalDateTime.now())
                        .modifiedAt(LocalDateTime.now())
                        .build();
                userInDb.get().setUsername(request.getUsername());
                userInDb.get().getAuthentications().add(localAuthentication);
                userInDb.get().setLastSignedIn(LocalDateTime.now());
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
                    .avatar("http://localhost:8272/api/v2/moon-movie/media/images/user-avatar.png")
                    .onboarded(true)
                    .modifiedAt(LocalDateTime.now())
                    .createdAt(LocalDateTime.now())
                    .lastSignedIn(LocalDateTime.now())
                    .role(role)
                    .authentications(List.of(localAuthentication))
                    .build();
            User savedUser = userDao.save(user);
            String token = jwtService.generateToken(savedUser, 7);
            String refreshToken = jwtService.generateToken(savedUser, 9);
            return AuthenticationResponse.builder()
                    .token(token)
                    .refreshToken(refreshToken)
                    .message("Register new user successfully!")
                    .build();
        }
    }

    @Override
    public AuthenticationResponse authenticateWithGoogle(String code, String redirectUrl) throws UnsupportedEncodingException {
        String accessGoogleToken = getOauthAccessTokenGoogle(code, redirectUrl);
        User tempUserInfo = getProfileDetailsGoogle(accessGoogleToken);
        Optional<User> userInDatabase = userDao.findByEmail(tempUserInfo.getEmail());

        // data return;
        String token = "";
        String refreshToken = "";

        if (userInDatabase.isPresent()) {
            userInDatabase.get().setEmail(tempUserInfo.getEmail());
            userInDatabase.get().setName(tempUserInfo.getName());
            userInDatabase.get().setAvatar(tempUserInfo.getAvatar());
            userInDatabase.get().setLastSignedIn(LocalDateTime.now());
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
                    .lastSignedIn(LocalDateTime.now())
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

    public String getOauthAccessTokenGoogle(String code, String redirectUri) {
        RestTemplate restTemplate = new RestTemplate();
        HttpHeaders httpHeaders = new HttpHeaders();
        httpHeaders.setContentType(MediaType.APPLICATION_FORM_URLENCODED);

        MultiValueMap<String, String> params = new LinkedMultiValueMap<>();
        params.add("code", code);
        params.add("redirect_uri", redirectUri);
        params.add("client_id", environment.getProperty("app.local.variable.client_id"));
        params.add("client_secret", environment.getProperty("app.local.variable.client_secret"));
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
        user.setLastSignedIn(LocalDateTime.now());
        userDao.save(user);
        return AuthenticationResponse.builder()
                .token(token)
                .refreshToken(refreshToken)
                .message("Sign in successfully!")
                .build();
    }

    private String generateRandomString(int length, String characters) {
        // a class in java.security
        SecureRandom random = new SecureRandom();
        StringBuilder result = new StringBuilder();

        for (int i = 0; i < length; i++) {
            int index = random.nextInt(characters.length());
            result.append(characters.charAt(index));
        }
        return result.toString();
    }

    @Override
    @Cacheable(value = "codeTmp", key = "#email")
    public ResponseTemplate sendOtpChangePassCode(String email) {

        ResponseTemplate responseMessage = new ResponseTemplate(200, "Check your otp code in your email!");
        Optional<User> user = userDao.findByEmail(email);
        // create otp code
        String code = generateRandomString(5, OTP_CHARACTERS);

        // create context for send mail
        Context context = new Context();
        if (user.isPresent()) {
            context.setVariable("code", code);
            context.setVariable("message", "Thank you for choosing Moon Movie. Use the following OTP to complete your Reset Password procedures. OTP is valid for 5 minutes.");
            responseMessage.setMessage("Receive otp code in your email!");
            mailService.sendEmailWithHtmlTemplate(email, "Code OTP", "otpCode", context);
            // send mail and save otp code in redis
            redisTemplate.opsForValue().set(email, code, 6, TimeUnit.MINUTES);
        } else {
            responseMessage.setMessage("This email has no account exist!");
            responseMessage.setStatus(400);
        }
        return responseMessage;
    }

    @Override
    public ResponseTemplate validCodeChangePass(AuthenticateOtpCodeRequest request) {
        ResponseTemplate responseMessage = new ResponseTemplate(200, "");
        String code = redisTemplate.opsForValue().get(request.getEmail());
        if (request.getCode() != null && request.getCode().equals(code)) {
            responseMessage.setMessage("The otp code is valid");
        } else {
            responseMessage.setMessage("The opt code is invalid");
            responseMessage.setStatus(400);
        }
        return responseMessage;
    }

    @Override
    public ResponseTemplate changePassword(ChangePasswordRequest request) {
        ResponseTemplate responseMessage = new ResponseTemplate(200, "");
        Optional<User> user = userDao.findByEmail(request.getEmail());
        if (user.isPresent()) {
            if (user.get().getAuthentications().size() == 1) {
                if (user.get().getAuthentications().get(0).getProvider().equalsIgnoreCase("google")) {
                    Authentication authentication = new Authentication();
                    authentication.setProvider("local");
                    authentication.setPassword(passwordEncoder.encode((request.getNewPassword())));
                    authentication.setCreatedAt(LocalDateTime.now());
                    authentication.setModifiedAt(LocalDateTime.now());
                    user.get().getAuthentications().add(authentication);
                } else {
                    user.get().getAuthentications().get(0).setPassword(passwordEncoder.encode((request.getNewPassword())));
                }
            } else {
                user.get().getAuthentications().forEach(authentication -> {
                    if (authentication.getProvider().equalsIgnoreCase("local")) {
                        authentication.setPassword(passwordEncoder.encode((request.getNewPassword())));
                    }
                });
            }

            userDao.save(user.get());
            responseMessage.setMessage("Change password successfully!");
        } else {
            responseMessage.setStatus(400);
            responseMessage.setMessage("This email have no account exists!");
        }
        return responseMessage;
    }
}
