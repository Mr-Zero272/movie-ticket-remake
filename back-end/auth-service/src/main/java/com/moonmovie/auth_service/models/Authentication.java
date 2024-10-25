package com.moonmovie.auth_service.models;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.LocalDateTime;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
@Document("authentication")
public class Authentication {
    private String provider; //'google' for OAuth, 'local' for username/password
//    private String providerId; // Google OAuth user ID or null for local
    private String password; // NULL for Google users
    private LocalDateTime createdAt;
    private LocalDateTime modifiedAt;
}
