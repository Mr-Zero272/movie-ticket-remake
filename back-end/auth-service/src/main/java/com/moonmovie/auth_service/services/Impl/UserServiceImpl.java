package com.moonmovie.auth_service.services.Impl;

import com.moonmovie.auth_service.dao.UserDao;
import com.moonmovie.auth_service.dto.UserDto;
import com.moonmovie.auth_service.exception.GlobalException;
import com.moonmovie.auth_service.feign.MediaServiceInterface;
import com.moonmovie.auth_service.helpers.Helpers;
import com.moonmovie.auth_service.models.User;
import com.moonmovie.auth_service.models.UserStatistical;
import com.moonmovie.auth_service.request.UpdateUserRequest;
import com.moonmovie.auth_service.response.PaginationResponse;
import com.moonmovie.auth_service.services.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.web.bind.MethodArgumentNotValidException;

import java.lang.reflect.Field;
import java.time.LocalDateTime;
import java.util.IdentityHashMap;
import java.util.List;
import java.util.Map;

@Service
public class UserServiceImpl implements UserService {
    @Autowired
    private UserDao userDao;

    @Autowired
    private MediaServiceInterface mediaServiceInterface;

    @Override
    public UserDto updateUser(UpdateUserRequest request, String userId) throws MethodArgumentNotValidException {
        User user = userDao.findById(userId).orElseThrow(() -> new GlobalException(400, "This user does not exist in the system."));
        if (!request.getUsername().equalsIgnoreCase(user.getUsername()) && userDao.countByUsername(request.getUsername()) == 1) {
            throw Helpers.createMethodArgumentNotValidException("username", "This username is already in use.");
        }

        if (!request.getEmail().equalsIgnoreCase(user.getEmail()) && userDao.countByEmail(request.getEmail()) == 1) {
            throw Helpers.createMethodArgumentNotValidException("email", "This email is already in use.");
        }

        List<String> fieldsSkip = List.of("avatar", "onboarded", "createdAt", "modifiedAt", "authentications");
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
        if (!request.getAvatar().equalsIgnoreCase(user.getAvatar())) {
            if (!request.getAvatar().substring(53).equalsIgnoreCase("user-avatar.png")) {
                Map<String, List<String>> req = new IdentityHashMap<>();
                req.put("filenames", List.of(user.getAvatar().substring(53)));
                mediaServiceInterface.deleteImages(req);
            }
            user.setAvatar(request.getAvatar());
        }
        return convertUserToDto(userDao.save(user));
    }

    @Override
    public UserDto getUser(String userId) {
        return convertUserToDto(userDao.findById(userId).orElseThrow(() -> new GlobalException(400, "This user does not exist in the system.")));
    }

    @Override
    public PaginationResponse<UserDto> getUsers(int page, int size, String userId, String usernameOrEmail, String sortBy, String sortOrder) {
        Pageable pageable;
        if (sortOrder.equalsIgnoreCase("desc")) {
            pageable = PageRequest.of(page - 1, size, Sort.by(Sort.Direction.DESC, sortBy));
        } else {
            pageable = PageRequest.of(page - 1, size,  Sort.by(Sort.Direction.ASC, sortBy));
        }
        Page<User> pageMovie;
        if (usernameOrEmail == null || usernameOrEmail.equalsIgnoreCase("")) {
            pageMovie = userDao.findAllByIdNotContainsIgnoreCase(userId, pageable);
        } else {
            pageMovie = userDao.findAllByIdNotContainsIgnoreCaseAndUsernameLikeOrEmailLike(userId, usernameOrEmail, usernameOrEmail, pageable);
        }
        List<UserDto> userDtos = pageMovie.getContent().stream().map(user -> convertUserToDto(user)).toList();

        PaginationResponse<UserDto> resp = PaginationResponse.<UserDto>builder()
                .data(userDtos)
                .page(page)
                .size(size)
                .totalPages(pageMovie.getTotalPages())
                .totalElements(pageMovie.getTotalElements())
                .build();
        return resp;
    }

    @Override
    public List<UserStatistical> fetchUserStatistical(int year) {
        return userDao.getUserStatistical(year);
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
                .lastSignedIn(user.getLastSignedIn())
                .build();
    }
}
