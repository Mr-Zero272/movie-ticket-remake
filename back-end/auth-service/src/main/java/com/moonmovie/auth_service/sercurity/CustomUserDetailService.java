package com.moonmovie.auth_service.sercurity;

import com.moonmovie.auth_service.dao.UserDao;
import com.moonmovie.auth_service.models.User;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

import java.util.ArrayList;

@Service
public class CustomUserDetailService implements UserDetailsService {
    @Autowired
    private UserDao userRepository;

    @Override
    public UserDetails loadUserByUsername(String usernameOrEmail) throws UsernameNotFoundException {
        // Check if it's an email or username
        User user = userRepository.findByEmail(usernameOrEmail)
                .orElseGet(() -> userRepository.findByUsername(usernameOrEmail)
                        .orElseThrow(() -> new UsernameNotFoundException("User not found with email or username: " + usernameOrEmail)));

        return new org.springframework.security.core.userdetails.User(user.getUsername(), user.getPassword(),
                new ArrayList<>());
    }
}
