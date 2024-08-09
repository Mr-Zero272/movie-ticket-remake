package com.moonmovie.user_service.dto;

import com.moonmovie.user_service.models.Role;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

/**
 * User Dto
 *
 * @author mr-zero272
 */
@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class UserDto {
    private String id;
    private String userClerkId;
    private String username;
    private String name;
    private String bio;
    private String avatar;
    private boolean onboarded;

    private LocalDateTime createdAt;
    private LocalDateTime modifiedAt;

    private Role role;
}
