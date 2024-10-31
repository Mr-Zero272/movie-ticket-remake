package com.moonmovie.movie_service.models;

import com.fasterxml.jackson.annotation.JsonBackReference;
import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.io.Serial;
import java.io.Serializable;
import java.time.LocalDateTime;
import java.util.List;

@Entity
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class Comment implements Serializable {

    @Serial
    private static final long serialVersionUID = 1L;

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;
    private String userId;;
    private String username;
    private String userProfileImage;
    private String content;
    private LocalDateTime createdAt;
    private LocalDateTime modifiedAt;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "movie_id")
    @JsonIgnore
    private Movie movie;

    @ManyToMany(cascade = { CascadeType.PERSIST, CascadeType.MERGE, CascadeType.REMOVE })
    @JoinTable(
            name = "parent_child_comment",
            joinColumns = @JoinColumn(name = "parent_comment_id"),
            inverseJoinColumns = @JoinColumn(name = "child_comment_id")
    )
    @JsonIgnore
    private List<Comment> childComments;

    @ManyToMany(mappedBy = "childComments", fetch = FetchType.LAZY)
    @JsonBackReference
    private List<Comment> parentComments;



    @Override
    public int hashCode() {
        return 2024;
    }

    @Override
    public boolean equals(Object obj) {
        if (this == obj)
            return true;
        if (obj == null)
            return false;
        if (getClass() != obj.getClass())
            return false;
        return id != null && id.equals(((Comment) obj).id);
    }

}
