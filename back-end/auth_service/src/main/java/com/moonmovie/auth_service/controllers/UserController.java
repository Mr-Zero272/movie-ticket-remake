package com.moonmovie.auth_service.controllers;

import com.moonmovie.auth_service.dto.UserDto;
import com.moonmovie.auth_service.request.UpdateUserRequest;
import com.moonmovie.auth_service.services.UserService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/v2/moon-movie/auth/user")
public class UserController {

    @Autowired
    private UserService userService;

    @GetMapping
    public ResponseEntity<UserDto> getUser(@RequestHeader("user-id") String userId) {
        return ResponseEntity.ok(userService.getUser(userId));
    }

    @PutMapping
    public ResponseEntity<UserDto> updateUser(@RequestHeader("user-id") String userId, @Valid @RequestBody UpdateUserRequest request) {
        return ResponseEntity.ok(userService.updateUser(request, userId));
    }
}
