package com.moonmovie.user_service.services;

import com.moonmovie.user_service.dto.UserDto;
import com.moonmovie.user_service.exceptions.UserException;
import com.moonmovie.user_service.models.User;

/**
 * User Service Interface
 *
 * @author mr-zero272
 */
public interface UserService {
    /**
     * Update user information.
     * @param userInfo User entity
     * @param userClerkId user's id
     *
     * @return User info after update
     * @throws UserException if have any error occurs
     */
    public User updateUser(UserDto userInfo, String userClerkId);

    /**
     * Add new user.
     * @param userInfo User entity
     *
     * @return User info after added
     * @throws UserException if have any error occurs
     */
    public User addUser(UserDto userInfo);

    /**
     * Get user info by user's id.
     * @param userClerkId User's id
     *
     * @return User information
     * @throws UserException if have any error occurs
     */
    public UserDto getUser(String userClerkId);
}
