package com.moonmovie.movie_service.services.Impl;

import com.moonmovie.movie_service.dao.GenreDao;
import com.moonmovie.movie_service.exceptions.GlobalException;
import com.moonmovie.movie_service.models.Genre;
import com.moonmovie.movie_service.responses.PaginationResponse;
import com.moonmovie.movie_service.services.GenreService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;

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
        Optional<Genre> genreCheck = genreDao.findByNameIgnoreCase(genre.getName());
        if (genreCheck.isPresent()) {
            throw new GlobalException(400, "This genre already exists.");
        }
        return genreDao.save(genre);
    }

    @Override
    public Genre updateGenre(Genre genreUpdate, int genreId) {
        Genre genre = genreDao.findById(genreId).orElseThrow(() -> new GlobalException(400, "This genre does not exist in the system."));
        if (!genre.getName().equals(genreUpdate.getName()) && genreDao.countByName(genreUpdate.getName()) == 1) {
            throw new GlobalException(400, "This genre's name already exists in the system.");
        }

        genre.setName(genreUpdate.getName());
        return genreDao.save(genre);
    }

    @Override
    public Genre deleteGenre(int genreId) {
        Optional<Genre> genreCheck = genreDao.findById(genreId);
        if (genreCheck.isEmpty()) {
            throw new GlobalException(400, "This genre does not exists.");
        }
        genreDao.delete(genreCheck.get());
        return genreCheck.get();
    }
}
