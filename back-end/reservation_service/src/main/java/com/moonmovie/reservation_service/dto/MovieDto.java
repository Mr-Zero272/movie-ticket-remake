package com.moonmovie.reservation_service.dto;

import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;

@Data
@NoArgsConstructor
public class MovieDto {
    private Integer id;
    private String title;
    private boolean adult;
    private int budget;
    private String originalLanguage;
    private String overview;
    private String status;
    private String video;
    private String posterPath;
    private String backdropPath;
    private float voteAverage;
    private int voteCount;
    private int runtime;
    private LocalDate releaseDate;
    private boolean deleteFlag;
}
