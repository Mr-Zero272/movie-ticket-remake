package com.moonmovie.auth_service.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class UserDto {
    private String id;
    @NotNull
    @Size(min = 3, max = 30)
    private String username;
    @NotNull
    @Email
    private String email;
    @NotNull
    @Size(min = 3, max = 30)
    private String name;
    @NotNull
    @Size(min = 1, max = 300)
    private String bio;
    @NotNull
    private String avatar;
    private boolean onboarded;
    private LocalDateTime createdAt;
    private LocalDateTime modifiedAt;
}
