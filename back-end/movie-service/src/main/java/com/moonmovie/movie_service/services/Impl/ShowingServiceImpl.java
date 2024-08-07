package com.moonmovie.movie_service.services.Impl;

import com.moonmovie.movie_service.dao.ShowingDao;
import com.moonmovie.movie_service.models.Showing;
import com.moonmovie.movie_service.services.ShowingService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class ShowingServiceImpl implements ShowingService {

    @Autowired
    private ShowingDao showingDao;

    @Override
    public Showing addShowing(Showing showing) {
        return showingDao.save(showing);
    }
}
