package com.moonmovie.user_service.services.Impl;

import com.moonmovie.user_service.constants.UserErrorConstants;
import com.moonmovie.user_service.dao.UserDao;
import com.moonmovie.user_service.dto.UserDto;
import com.moonmovie.user_service.exceptions.UserException;
import com.moonmovie.user_service.models.Role;
import com.moonmovie.user_service.models.User;
import com.moonmovie.user_service.services.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.Optional;
/**
 * User Service Implement
 *
 * @author mr-zero272
 */
@Service
public class UserServiceImpl implements UserService {
    @Autowired
    private UserDao userDao;

    /**
     * Update user information.
     * @param userInfo User entity
     * @param userClerkId user's id
     *
     * @return User info after update
     * @throws UserException if have any error occurs
     */
    @Override
    public User updateUser(UserDto userInfo, String userClerkId) {
        Optional<User> userInDb = userDao.findByUserClerkId(userClerkId);
        if (userInDb.isPresent()) {
            if (!userInDb.get().getUsername().equalsIgnoreCase(userInfo.getUsername())) {
                Optional<User> userSameUserNameExists = userDao.findByUsername(userInfo.getUsername());
                if (userSameUserNameExists.isPresent()) {
                    throw new UserException(UserErrorConstants.ERROR_USERNAME_EXISTS);
                }
                userInDb.get().setUsername(userInfo.getUsername());
                userInDb.get().setName(userInfo.getName());
                userInDb.get().setBio(userInfo.getBio());
                userInDb.get().setAvatar(userInfo.getAvatar());
                userInDb.get().setModifiedAt(LocalDateTime.now());

                return userDao.save(userInDb.get());
            }
            userInDb.get().setName(userInfo.getName());
            userInDb.get().setBio(userInfo.getBio());
            userInDb.get().setAvatar(userInfo.getAvatar());
            userInDb.get().setModifiedAt(LocalDateTime.now());

            return userDao.save(userInDb.get());
        } else {
            throw new UserException(UserErrorConstants.ERROR_USER_NOT_FOUND);
        }
    }

    @Override
    public User addUser(UserDto userInfo) {
        Optional<User> userInDb = userDao.findByUsername(userInfo.getUsername());
        if (userInDb.isPresent()) {
            throw new UserException(UserErrorConstants.ERROR_USERNAME_EXISTS);
        }

        User user = convertUserDtoToUser(userInfo);
        user.setCreatedAt(LocalDateTime.now());
        user.setRole(Role.USER);
        user.setOnboarded(true);

        return userDao.save(user);
    }

    @Override
    public UserDto getUser(String userClerkId) {
        Optional<User> userInDb = userDao.findByUserClerkId(userClerkId);
        if (userInDb.isPresent()) {
            return convertUserToUserDto(userInDb.get());
        } else {
            throw new UserException(UserErrorConstants.ERROR_USER_NOT_FOUND);
        }
    }

    public User convertUserDtoToUser(UserDto userDto) {
        User user = new User();
        user.setUsername(userDto.getUsername());
        user.setName(userDto.getName());
        user.setBio(userDto.getBio());
        user.setAvatar(userDto.getAvatar());
        user.setModifiedAt(LocalDateTime.now());
        user.setUserClerkId(userDto.getUserClerkId());
        return user;
    }

    public UserDto convertUserToUserDto(User user) {
        UserDto userDto = new UserDto();
        userDto.setId(user.getId());
        userDto.setUsername(user.getUsername());
        userDto.setName(user.getName());
        userDto.setBio(user.getBio());
        userDto.setAvatar(user.getAvatar());
        userDto.setUserClerkId(user.getUserClerkId());
        userDto.setOnboarded(user.isOnboarded());
        userDto.setCreatedAt(user.getCreatedAt());
        userDto.setModifiedAt(user.getModifiedAt());
        userDto.setRole(user.getRole());
        return userDto;
    }
}
