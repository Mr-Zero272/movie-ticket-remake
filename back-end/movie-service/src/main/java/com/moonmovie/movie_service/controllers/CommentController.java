package com.moonmovie.movie_service.controllers;

import com.moonmovie.movie_service.models.Comment;
import com.moonmovie.movie_service.requests.AddCommentRequest;
import com.moonmovie.movie_service.services.CommentService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("api/v2/moon-movie/movie/comment")
public class CommentController {
    
    @Autowired
    private CommentService commentService;

    @GetMapping("/{commentId}")
    public ResponseEntity<Comment> getComment(@PathVariable Integer commentId) {
        return new ResponseEntity<>(commentService.getCommentById(commentId), HttpStatus.OK);
    }

    @PostMapping
    public ResponseEntity<Comment> createComment(@RequestBody AddCommentRequest comment) {
        return ResponseEntity.ok(commentService.addComment(comment));
    }

    @PutMapping("/{commentId}")
    public ResponseEntity<Comment> updateComment(@PathVariable Integer commentId,
                                                 @RequestBody Map<String, String> request) {
        return ResponseEntity.ok(commentService.updateComment(request.get("content"), commentId));
    }

    @DeleteMapping("/{commentId}")
    public ResponseEntity<Comment> deleteComment(@PathVariable Integer commentId) {
        return ResponseEntity.ok(commentService.deleteComment(commentId));
    }

    @GetMapping("/movie/{movieId}")
    public ResponseEntity<List<Comment>> getCommentByMovie(@PathVariable Integer movieId) {
        return ResponseEntity.ok(commentService.getAllCommentOfAnMovie(movieId));
    }

    @GetMapping("/reply/{commentId}")
    public ResponseEntity<List<Comment>> getAllRepliesByCommentId(@PathVariable Integer commentId) {
        return ResponseEntity.ok(commentService.getAllRepliesByCommentId(commentId));
    }
}
