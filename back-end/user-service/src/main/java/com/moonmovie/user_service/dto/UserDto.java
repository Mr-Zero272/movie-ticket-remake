package com.moonmovie.user_service.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

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
}
