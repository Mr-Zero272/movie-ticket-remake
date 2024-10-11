package com.moonmovie.auth_service.services;

import com.moonmovie.auth_service.dto.UserDto;
import com.moonmovie.auth_service.models.UserStatistical;
import com.moonmovie.auth_service.request.UpdateUserRequest;
import com.moonmovie.auth_service.response.PaginationResponse;
import org.springframework.web.bind.MethodArgumentNotValidException;

import java.util.List;

public interface UserService {
    UserDto updateUser(UpdateUserRequest request, String userId) throws MethodArgumentNotValidException;
    UserDto getUser(String userId);
    PaginationResponse<UserDto> getUsers(int page, int size, String userId, String usernameOrEmail, String sortBy, String sortOrder);
    List<UserStatistical> fetchUserStatistical(int year);
}
