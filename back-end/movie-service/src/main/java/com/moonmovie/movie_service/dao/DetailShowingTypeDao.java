package com.moonmovie.movie_service.dao;

import com.moonmovie.movie_service.models.DetailShowingType;
import org.springframework.data.repository.CrudRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface DetailShowingTypeDao extends CrudRepository<DetailShowingType, Integer> {
    List<DetailShowingType> findAllByIdIn(List<Integer> ids);
}
