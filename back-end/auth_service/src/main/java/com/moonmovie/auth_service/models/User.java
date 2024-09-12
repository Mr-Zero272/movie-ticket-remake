package com.moonmovie.auth_service.models;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;

import java.io.Serial;
import java.io.Serializable;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.Collection;
import java.util.List;
import java.util.concurrent.atomic.AtomicReference;

/**
 * User Entity
 *
 * @author mr-zero272
 */
@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
@Document("user")
public class User implements Serializable, UserDetails {
    /**
     *
     */
    @Serial
    private static final long serialVersionUID = 1L;
    @Id
    private String id;
    private String username;
    private String email;
    private String name;
    private String bio;
    private String avatar;
    private boolean onboarded;
    private LocalDateTime createdAt;
    private LocalDateTime modifiedAt;

    List<Authentication> authentications = new ArrayList<>();

    private Role role;

    @Override
    public Collection<? extends GrantedAuthority> getAuthorities() {
        return List.of(new SimpleGrantedAuthority(role.name()));
    }

    @Override
    public String getPassword() {
        AtomicReference<String> password = new AtomicReference<>("");
        this.authentications.forEach(a -> {
            if (a.getProvider().equalsIgnoreCase("local")) {
                password.set(a.getPassword());
            }
        });
        return password.get();
    }

    @Override
    public boolean isAccountNonExpired() {
        return true;
    }

    @Override
    public boolean isAccountNonLocked() {
        return true;
    }

    @Override
    public boolean isCredentialsNonExpired() {
        return true;
    }

    @Override
    public boolean isEnabled() {
        return true;
    }

}

