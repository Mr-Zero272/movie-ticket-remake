package com.moonmovie.movie_service.dao;

import com.moonmovie.movie_service.models.Comment;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface CommentDao extends JpaRepository<Comment, Integer> {
    @Query("SELECT c.childComments FROM Comment c WHERE c.id = :commentId ORDER BY c.modifiedAt")
    List<Comment> findRepliesByCommentId(@Param("commentId") int commentId);

    @Query("SELECT c FROM Comment c WHERE c.movie.id = :movieId AND c NOT IN (SELECT childComment FROM Comment parent" +
            " JOIN parent.childComments childComment)")
    List<Comment> findFirstLevelCommentsByMovieId(@Param("movieId") Integer movieId);

    @Query("SELECT c FROM Comment c " +
            "LEFT JOIN FETCH c.childComments child " +
            "WHERE c.movie.id = :movieId " +
            "AND c NOT IN (SELECT childComment FROM Comment parent JOIN parent.childComments childComment) ORDER BY c.modifiedAt")
    List<Comment> findFirstAndSecondLevelCommentsByMovieId(@Param("movieId") Integer movieId);
}
