package com.moonmovie.auth_service.controllers;

import com.moonmovie.auth_service.dto.UserDto;
import com.moonmovie.auth_service.exception.GlobalException;
import com.moonmovie.auth_service.models.UserStatistical;
import com.moonmovie.auth_service.request.UpdateUserRequest;
import com.moonmovie.auth_service.response.PaginationResponse;
import com.moonmovie.auth_service.services.UserService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v2/moon-movie/auth")
public class UserController {

    @Autowired
    private UserService userService;

    @GetMapping("/user")
    public ResponseEntity<UserDto> getUser(@RequestHeader("user-id") String userId) {
        return ResponseEntity.ok(userService.getUser(userId));
    }

    @GetMapping("/user/profile/{userId}")
    public ResponseEntity<UserDto> getUserProfile(
            @RequestHeader("role") String role,
            @PathVariable("userId") String userId) {
        if (!role.equalsIgnoreCase("admin")) {
            throw new GlobalException(403, "Do not have permission!");
        }
        return ResponseEntity.ok(userService.getUser(userId));
    }

    @PutMapping("/user")
    public ResponseEntity<UserDto> updateUser(@RequestHeader("user-id") String userId, @Valid @RequestBody UpdateUserRequest request) throws MethodArgumentNotValidException {
        return ResponseEntity.ok(userService.updateUser(request, userId));
    }

    @GetMapping("/users")
    public ResponseEntity<PaginationResponse<UserDto>> getUsers(
            @RequestHeader("user-id") String userId,
            @RequestParam(value = "usernameOrEmail", defaultValue = "") String usernameOrEmail,
            @RequestParam(value = "page", defaultValue = "1") int page,
            @RequestParam(value = "size", defaultValue = "20") int size,
            @RequestParam(value = "sortBy", defaultValue = "createdAt") String sortBy,
            @RequestParam(value = "sortOrder", defaultValue = "desc") String sortOrder
    ) {
        return ResponseEntity.ok(userService.getUsers(page, size, userId, usernameOrEmail, sortBy, sortOrder));
    }

    @GetMapping("/users/statistical")
    public ResponseEntity<List<UserStatistical>> getStatisticalUsers(@RequestParam("year") int year) {
        return ResponseEntity.ok(userService.fetchUserStatistical(year));
    }
}
