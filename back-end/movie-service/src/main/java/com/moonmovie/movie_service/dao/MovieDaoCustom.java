package com.moonmovie.movie_service.dao;

import com.moonmovie.movie_service.models.Genre;
import com.moonmovie.movie_service.models.Movie;
import jakarta.persistence.EntityManager;
import jakarta.persistence.criteria.*;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Repository;

import java.util.ArrayList;
import java.util.List;

@Repository
public class MovieDaoCustom{
    private final EntityManager entityManager;

    public MovieDaoCustom(EntityManager entityManager) {
        this.entityManager = entityManager;
    }

    public Page<Movie> findAllWithFilters(List<String> queries, Integer genreId, String originalLanguage, String status, String sort, Pageable pageable) {
        CriteriaBuilder cb = entityManager.getCriteriaBuilder();
        CriteriaQuery<Movie> query = cb.createQuery(Movie.class);
        Root<Movie> movieRoot = query.from(Movie.class);

        // Build predicates based on your criteria
        List<Predicate> titlePredicates  = new ArrayList<>();
        for (String queryString : queries) {
            if (queryString.equalsIgnoreCase("%")) {
                titlePredicates.add(cb.like(movieRoot.get("title"), "%"));
                continue;
            }
            titlePredicates.add(cb.like(movieRoot.get("title"), "%" + queryString + "%"));
        }

        Predicate titlePredicate = cb.or(titlePredicates.toArray(new Predicate[0]));

        // Predicate for original language matching the genreId
        Predicate languagePredicate = cb.equal(movieRoot.get("originalLanguage"), originalLanguage);

        // Predicate for status matching the genreId
        Predicate statusPredicate = cb.equal(cb.lower(movieRoot.get("status")), status.toLowerCase());

        // Combine predicates
        if (genreId == null) {
            query.where(cb.and(titlePredicate, languagePredicate, statusPredicate));
        } else {
            Join<Movie, Genre> genreJoin = movieRoot.join("genres");
            // Predicate for genre matching the genreId
            Predicate genrePredicate = cb.equal(genreJoin.get("id"), genreId);
            query.where(cb.and(titlePredicate, genrePredicate, languagePredicate, statusPredicate));
        }

        // Apply sorting
        if (!sort.equalsIgnoreCase("none") && !sort.equalsIgnoreCase("")) {
            query.orderBy(cb.asc(movieRoot.get(sort))); // Example: Sort by 'field'
        }

        // Fetch paginated data
        List<Movie> resultList = entityManager.createQuery(query)
                .setFirstResult((int) pageable.getOffset())
                .setMaxResults(pageable.getPageSize())
                .getResultList();

        // Fetch total count for pagination
        CriteriaQuery<Long> countQuery = cb.createQuery(Long.class);
        Root<Movie> countRoot = countQuery.from(Movie.class);

        // Recreate the predicates
        List<Predicate> countTitlePredicates = new ArrayList<>();
        for (String queryString : queries) {
            if (queryString.equalsIgnoreCase("%")) {
                countTitlePredicates.add(cb.like(countRoot.get("title"), "%"));
                continue;
            }
            countTitlePredicates.add(cb.like(countRoot.get("title"), "%" + queryString + "%"));
        }

        Predicate countTitlePredicate = cb.or(countTitlePredicates.toArray(new Predicate[0]));
        Predicate countLanguagePredicate = cb.equal(countRoot.get("originalLanguage"), originalLanguage);
        Predicate countStatusPredicate = cb.equal(cb.lower(countRoot.get("status")), status.toLowerCase());

        // Apply the predicates to the count query
        if (genreId == null) {
            countQuery.select(cb.count(countRoot))
                    .where(cb.and(countTitlePredicate, countLanguagePredicate, countStatusPredicate));
        } else {
            Join<Movie, Genre> countGenreJoin = countRoot.join("genres", JoinType.INNER);
            Predicate countGenrePredicate = cb.equal(countGenreJoin.get("id"), genreId);
            countQuery.select(cb.count(countRoot))
                    .where(cb.and(countTitlePredicate, countGenrePredicate, countLanguagePredicate, countStatusPredicate));
        }

        // Execute the count query
        Long totalCount = entityManager.createQuery(countQuery).getSingleResult();

        // Return a Page<Entity>
        return new PageImpl<>(resultList, pageable, totalCount);
    }
}
