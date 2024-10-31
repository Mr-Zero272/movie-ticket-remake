package com.moonmovie.movie_service.services;

import com.moonmovie.movie_service.models.Comment;
import com.moonmovie.movie_service.requests.AddCommentRequest;

import java.util.List;

public interface CommentService {
    Comment addComment(AddCommentRequest comment);
    Comment getCommentById(int id);
    List<Comment> getAllRepliesByCommentId(int id);
    List<Comment> getAllCommentOfAnMovie(int movieId);
    Comment updateComment(String content, Integer commentId);
    Comment deleteComment(int id);
}
