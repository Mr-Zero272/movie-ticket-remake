package com.moonmovie.movie_service.services.Impl;

import com.moonmovie.movie_service.dao.GenreDao;
import com.moonmovie.movie_service.models.Genre;
import com.moonmovie.movie_service.responses.PaginationResponse;
import com.moonmovie.movie_service.services.GenreService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;

import java.util.Collections;
import java.util.List;
import java.util.Optional;

@Service
public class GenreServiceImpl implements GenreService {

    @Autowired
    private GenreDao genreDao;

    @Override
    public PaginationResponse<Genre> getAllGenres(String q, String sort, String sortOrder, int page, int size) {

        Pageable pageable;
        if (sort.isEmpty() || sort.equalsIgnoreCase("none")) {
            pageable = PageRequest.of(page - 1, size);
        } else {
            if (sortOrder.equals("asc")) {
                pageable = PageRequest.of(page - 1, size, Sort.by(Sort.Direction.ASC, sort));
            } else {
                pageable = PageRequest.of(page - 1, size, Sort.by(Sort.Direction.DESC, sort));
            }
        }
        Page<Genre> pageGenre;
        if (q.equalsIgnoreCase("")) {
            pageGenre = genreDao.findAll(pageable);
        } else {
            pageGenre = genreDao.findAllByNameContainingIgnoreCase(q, pageable);
        }
        PaginationResponse<Genre> resp = PaginationResponse.<Genre>builder()
                .data(pageGenre.getContent())
                .page(page)
                .size(size)
                .totalPages(pageGenre.getTotalPages())
                .totalElements(pageGenre.getTotalElements())
                .build();
        return resp;
    }

    @Override
    public Genre addGenre(Genre genre) {
        return genreDao.save(genre);
    }

    @Override
    public Genre updateGenre(Genre genre, int genreId) {
        Optional<Genre> genreOptional = genreDao.findById(genreId);
        if (genreOptional.isPresent()) {
            Genre genreToUpdate = genreOptional.get();
            genreToUpdate.setName(genre.getName());
            return genreDao.save(genreToUpdate);
        }
        return null;
    }
}
