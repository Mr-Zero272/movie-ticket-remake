package com.moonmovie.auth_service.dao;

import com.moonmovie.auth_service.models.User;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface UserDao extends MongoRepository<User, String> {
    Optional<User> findByUsername(String username);
    Optional<User> findByEmail(String email);
    Optional<User> findByEmailAndUsername(String email, String username);

    Integer countByUsername(String username);
    Integer countByEmail(String email);

    Page<User> findAllByIdNotContainsIgnoreCaseAndUsernameLikeOrEmailLike(String id, String username, String email, Pageable pageable);
    Page<User> findAllByIdNotContainsIgnoreCase(String id, Pageable pageable);
}
