package com.moonmovie.user_service.controllers;

import com.moonmovie.user_service.dto.UserDto;
import com.moonmovie.user_service.models.User;
import com.moonmovie.user_service.services.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/v2/moon-movie/user")
public class UserController {
    @Autowired
    private UserService userService;

    @GetMapping
    public ResponseEntity<UserDto> getUser(@RequestHeader("user-id") String userId) {
        UserDto user = userService.getUser(userId);
        return ResponseEntity.ok(user);
    }

    @PostMapping
    public ResponseEntity<User> createUser(@RequestBody UserDto userDto) {
        User user = userService.addUser(userDto);
        return ResponseEntity.ok(user);
    }

    @PutMapping
    public ResponseEntity<User> updateUser(@RequestHeader("user-id") String userId, @RequestBody UserDto userDto) {
        return ResponseEntity.ok(userService.updateUser(userDto, userId));
    }
}