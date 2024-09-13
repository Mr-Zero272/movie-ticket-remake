package com.moonmovie.auth_service.services.Impl;

import com.moonmovie.auth_service.dao.UserDao;
import com.moonmovie.auth_service.dto.UserDto;
import com.moonmovie.auth_service.exception.GlobalException;
import com.moonmovie.auth_service.helpers.Helpers;
import com.moonmovie.auth_service.models.User;
import com.moonmovie.auth_service.request.UpdateUserRequest;
import com.moonmovie.auth_service.services.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.web.bind.MethodArgumentNotValidException;

import java.lang.reflect.Field;
import java.time.LocalDateTime;
import java.util.List;

@Service
public class UserServiceImpl implements UserService {
    @Autowired
    private UserDao userDao;

    @Override
    public UserDto updateUser(UpdateUserRequest request, String userId) throws MethodArgumentNotValidException {
        User user = userDao.findById(userId).orElseThrow(() -> new GlobalException(400, "This user does not exist in the system."));
        if (!request.getUsername().equalsIgnoreCase(user.getUsername()) && userDao.countByUsername(request.getUsername()) == 1) {
            throw Helpers.createMethodArgumentNotValidException("username", "This username is already in use.");
        }

        if (!request.getEmail().equalsIgnoreCase(user.getEmail()) && userDao.countByEmail(request.getEmail()) == 1) {
            throw Helpers.createMethodArgumentNotValidException("email", "This email is already in use.");
        }

        List<String> fieldsSkip = List.of("onboarded", "createdAt", "modifiedAt", "authentications");
        for (Field updateField : request.getClass().getDeclaredFields()) {
            updateField.setAccessible(true);
            try {
                if (fieldsSkip.contains(updateField.getName())) continue;
                Object value = updateField.get(request);
                if (value != null) {
                    try {
                        Field entityField = user.getClass().getDeclaredField(updateField.getName());
                        entityField.setAccessible(true);
                        entityField.set(user, value);
                    } catch (NoSuchFieldException e) {
                        // Handle the case where the field does not exist in the User entity
                        System.out.println("Field " + updateField.getName() + " does not exist in User entity, skipping...");
                    }
                }
            } catch (IllegalAccessException e) {
                throw new RuntimeException(e);
            }
        }

        user.setModifiedAt(LocalDateTime.now());
        user.setOnboarded(true);
        return convertUserToDto(userDao.save(user));
    }

    @Override
    public UserDto getUser(String userId) {
        return convertUserToDto(userDao.findById(userId).orElseThrow(() -> new GlobalException(400, "This user does not exist in the system.")));
    }

    private UserDto convertUserToDto(User user) {
        return UserDto.builder()
                .id(user.getId())
                .username(user.getUsername())
                .email(user.getEmail())
                .name(user.getName())
                .bio(user.getBio())
                .avatar(user.getAvatar())
                .onboarded(user.isOnboarded())
                .createdAt(user.getCreatedAt())
                .modifiedAt(user.getModifiedAt())
                .build();
    }
}
