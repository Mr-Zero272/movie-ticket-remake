package com.moonmovie.movie_service.requests;

import com.moonmovie.movie_service.models.DetailShowingType;
import lombok.Data;

import java.time.LocalDate;
import java.util.List;

@Data
public class MovieRequest {

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
    private List<Integer> genreIds;
    private List<String> galleries;

    // for schedule
    private int monthToSchedule;
    private int yearToSchedule = 2024;
    private int totalShowings;
    private int priceEachSeat;

    private List<DetailShowingType> detailShowingTypes;
}
