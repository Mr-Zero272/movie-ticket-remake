package com.moonmovie.movie_service.services.Impl;

import com.moonmovie.movie_service.dao.ShowingDao;
import com.moonmovie.movie_service.models.Showing;
import com.moonmovie.movie_service.services.ShowingService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.time.LocalDateTime;
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
    public List<Showing> getAllShowings(LocalDateTime startDate, int movieId) {
        return showingDao.findAllByStartTimeGreaterThanEqualAndDateIsAndMovieIdIs(startDate, startDate.getDayOfMonth(), movieId);
    }
}
