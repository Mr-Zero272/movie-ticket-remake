package com.moonmovie.auth_service.request;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.Data;

@Data
public class UpdateUserRequest {
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
}
