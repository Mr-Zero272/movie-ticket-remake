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
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.HashSet;
import java.util.List;
import java.util.Set;

@Entity
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class Movie implements Serializable {

    @Serial
    private static final long serialVersionUID = 1L;

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;
    private String title;
    private boolean adult;
    private int budget;
    private String originalLanguage;
    @Lob
    @Column(length = 1000)
    private String overview;
    private String status;
    private String video;
    private String posterPath;
    private String backdropPath;
    private float voteAverage;
    private int voteCount;
    private int runtime;
    private LocalDate releaseDate;
    private boolean deleteFlag = false;
    private LocalDateTime createdAt;
    private LocalDateTime modifiedAt;

    @ManyToMany(cascade = { CascadeType.PERSIST, CascadeType.MERGE })
    @JoinTable(name = "movie_genre", joinColumns = @JoinColumn(name = "movie_id"), inverseJoinColumns = @JoinColumn(name = "genre_id"))
    private Set<Genre> genres = new HashSet<>();

    // for schedule
    private int monthToSchedule;
    private int yearToSchedule = 2024;
    private int totalShowings;
    private int totalDateShowingsInMonth;
    private int priceEachSeat;

    @OneToMany(cascade = CascadeType.ALL, mappedBy = "movie", orphanRemoval = true)
    private List<DetailShowingType> detailShowingTypes = new ArrayList<>();

    @OneToMany(cascade = CascadeType.ALL, mappedBy = "movie", orphanRemoval = true)
    private List<Gallery> galleries = new ArrayList<>();

    @OneToMany(cascade = CascadeType.ALL, mappedBy = "movie", orphanRemoval = true)
    @JsonBackReference
    private List<Showing> showings = new ArrayList<>();

    @OneToMany(cascade = CascadeType.ALL, mappedBy = "movie", orphanRemoval = true)
    private List<UserFavoriteMovie> userFavoriteMovies = new ArrayList<>();

    @OneToMany(cascade = CascadeType.ALL, mappedBy = "movie", orphanRemoval = true)
    @JsonBackReference
    private List<Comment> comments = new ArrayList<>();

    @Override
    public int hashCode() {
        return 2023;
    }

    @Override
    public boolean equals(Object obj) {
        if (this == obj)
            return true;
        if (obj == null)
            return false;
        if (getClass() != obj.getClass())
            return false;
        return id != null && id.equals(((Movie) obj).id);
    }

}





