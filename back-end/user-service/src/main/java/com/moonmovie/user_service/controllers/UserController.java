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

    @GetMapping("/{userClerkId}")
    public ResponseEntity<UserDto> getUser(@PathVariable("userClerkId") String userId) {
            return ResponseEntity.ok(userService.getUser(userId));
    }

    @PostMapping
    public ResponseEntity<User> createUser(@RequestBody UserDto userDto) {
        return ResponseEntity.ok(userService.addUser(userDto));
    }

    @PutMapping("/{userClerkId}")
    public ResponseEntity<User> updateUser(@PathVariable("userClerkId") String userClerkId, @RequestBody UserDto userDto) {
        return ResponseEntity.ok(userService.updateUser(userDto, userClerkId));
    }
}