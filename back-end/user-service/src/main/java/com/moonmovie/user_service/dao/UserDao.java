package com.moonmovie.user_service.dao;

import com.moonmovie.user_service.dto.UserDto;
import com.moonmovie.user_service.models.Role;
import com.moonmovie.user_service.models.StatisticalUser;
import com.moonmovie.user_service.models.User;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.mongodb.repository.Aggregation;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.data.mongodb.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface UserDao extends MongoRepository<User, String> {
    Optional<User> findByUsername(String username);

    Optional<User> findByUserClerkId(String userClerkId);

    @Query("{ 'username' : { $regex: ?0, $options: 'i' } }")
    Page<UserDto> findAllByName(Pageable pageable, String name);

    @Query("{ 'username' : { $regex: '', $options: 'i' } }")
    Page<UserDto> findAllDto(Pageable pageable);

    Page<User> findByUsernameLike(Pageable pageable, String username);

    Integer countUserByRole(@Param("role") Role role);

    @Aggregation({"{ $project: { month: {$month: \"$createdAt\"}, year:  {$year: \"$createdAt\" }}}",
            "{ $match: {year: ?0, month : ?1 } }",
            " { $count: \"totalUser\" }"})
    Integer countUsersByMonth(int year, int month);

    @Aggregation({"{ $project: { month: {$month: \"$createdAt\"}, year: {$year: \"$createdAt\"}, role: 1 } }",
            "{ $match: { role: ?0, year: ?1 } }",
            "{ $group: { _id: {month: \"$month\"}, totalUser: { $sum: NumberInt(1)}}  }",
            "{ $sort: { \"_id.month\": 1 } }",
            "{ $project: { _id: 0, month: \"$_id.month\", totalUser: 1, } }"})
    List<StatisticalUser> statisticalUser(String role, int year);
}
