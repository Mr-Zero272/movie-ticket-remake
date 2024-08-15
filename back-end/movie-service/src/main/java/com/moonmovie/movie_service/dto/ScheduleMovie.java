package com.moonmovie.movie_service.dto;

import com.moonmovie.movie_service.models.DetailShowingType;
import com.moonmovie.movie_service.models.Movie;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.ArrayList;
import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class ScheduleMovie {
    private int movieId;
    private int monthToSchedule;
    private int yearToSchedule;
    private int totalShowings;
    private int totalDateShowingsInMonth;
    private int priceEachSeat;
    private List<DetailShowingType> detailShowingTypes;

    public ScheduleMovie(Movie that) {
        this.movieId = that.getId();
        this.monthToSchedule = that.getMonthToSchedule();
        this.yearToSchedule = that.getYearToSchedule();
        this.totalShowings = that.getTotalShowings();
        this.totalDateShowingsInMonth = that.getTotalDateShowingsInMonth();
        this.priceEachSeat = that.getPriceEachSeat();

        List<DetailShowingType> detailShowingTypeList = new ArrayList<>();
        for (DetailShowingType detailShowingType: that.getDetailShowingTypes()) {
            detailShowingTypeList.add(new DetailShowingType(detailShowingType));
        }
        this.detailShowingTypes = detailShowingTypeList;
    }
}
