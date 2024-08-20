package com.moonmovie.movie_service.services.Impl;

import com.moonmovie.movie_service.constants.MovieErrorConstants;
import com.moonmovie.movie_service.dao.ShowingDao;
import com.moonmovie.movie_service.dto.ShowingDto;
import com.moonmovie.movie_service.exceptions.MovieException;
import com.moonmovie.movie_service.models.Showing;
import com.moonmovie.movie_service.services.ShowingService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Service
public class ShowingServiceImpl implements ShowingService {

    @Autowired
    private ShowingDao showingDao;

    @Override
    public Showing addShowing(Showing showing) {
        return showingDao.save(showing);
    }

    @Override
    public List<ShowingDto> getAllShowings(LocalDateTime startDate, int movieId) {
        List<ShowingDto> showings = showingDao.findAllByStartTimeGreaterThanEqualAndDateIsAndMovieIdIs(startDate, startDate.getDayOfMonth(), movieId);
        return showings;
    }

    @Override
    public Showing getShowing(int showingId) {
        return showingDao.findById(showingId).orElseThrow(() -> new MovieException(MovieErrorConstants.ERROR_SHOWING_NOT_EXISTS));
    }
}
