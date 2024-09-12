package com.moonmovie.auth_service.services;

import com.moonmovie.auth_service.dto.UserDto;
import com.moonmovie.auth_service.request.UpdateUserRequest;

public interface UserService {
    UserDto updateUser(UpdateUserRequest request, String userId);
    UserDto getUser(String userId);
}
