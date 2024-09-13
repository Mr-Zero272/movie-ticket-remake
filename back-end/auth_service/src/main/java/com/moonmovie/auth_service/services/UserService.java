package com.moonmovie.auth_service.services;

import com.moonmovie.auth_service.dto.UserDto;
import com.moonmovie.auth_service.request.UpdateUserRequest;
import org.springframework.web.bind.MethodArgumentNotValidException;

public interface UserService {
    UserDto updateUser(UpdateUserRequest request, String userId) throws MethodArgumentNotValidException;
    UserDto getUser(String userId);
}
