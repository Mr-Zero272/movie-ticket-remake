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
public class MovieDaoCustom {
    private final EntityManager entityManager;

    public MovieDaoCustom(EntityManager entityManager) {
        this.entityManager = entityManager;
    }

    public Page<Movie> findAllWithFilters(List<String> queries, Integer genreId, String originalLanguage, String status, String sort, String sortOrder, Pageable pageable) {
        CriteriaBuilder cb = entityManager.getCriteriaBuilder();
        CriteriaQuery<Movie> query = cb.createQuery(Movie.class);
        Root<Movie> movieRoot = query.from(Movie.class);

        // Build predicates based on your criteria
        List<Predicate> titlePredicates = new ArrayList<>();
        Expression<Integer> relevanceScore = cb.literal(0);

        for (String queryString : queries) {
            Predicate likePredicate;
            if (queryString.equalsIgnoreCase("%")) {
                likePredicate = cb.like(movieRoot.get("title"), "%");
            } else {
                likePredicate = cb.like(movieRoot.get("title"), "%" + queryString + "%");
            }
            titlePredicates.add(likePredicate);

            // Increment relevance score when the term is present in the title
            relevanceScore = cb.sum(relevanceScore, cb.<Integer>selectCase().when(likePredicate, 1).otherwise(0));
        }

        Predicate titlePredicate = cb.or(titlePredicates.toArray(new Predicate[0]));

        // Predicate for original language matching the genreId
        Predicate languagePredicate;
        if (originalLanguage == null || originalLanguage.equalsIgnoreCase("") || originalLanguage.equalsIgnoreCase("none")) {
            languagePredicate = cb.like(movieRoot.get("originalLanguage"), "%");
        } else {
            languagePredicate = cb.equal(movieRoot.get("originalLanguage"), originalLanguage);
        }

        // Predicate for status matching the genreId
        Predicate statusPredicate;
        if (status == null || status.equalsIgnoreCase("") || status.equalsIgnoreCase("none")) {
            statusPredicate = cb.like(movieRoot.get("status"), "%");
        } else {
            statusPredicate = cb.equal(cb.lower(movieRoot.get("status")), status.toLowerCase());
        }

        // Predicate for delete flag
        Predicate deleteFlagPredicate = cb.equal(movieRoot.get("deleteFlag"), false);

        // Combine predicates
        if (genreId == null) {
            query.where(cb.and(titlePredicate, languagePredicate, statusPredicate, deleteFlagPredicate));
        } else {
            Join<Movie, Genre> genreJoin = movieRoot.join("genres");
            // Predicate for genre matching the genreId
            Predicate genrePredicate = cb.equal(genreJoin.get("id"), genreId);
            query.where(cb.and(titlePredicate, genrePredicate, languagePredicate, statusPredicate, deleteFlagPredicate));
        }

        // Apply sorting by relevance first, then by the requested sort field
        if (!sort.equalsIgnoreCase("none") && !sort.equalsIgnoreCase("")) {
            if (sortOrder.equalsIgnoreCase("desc")) {
                query.orderBy(cb.desc(relevanceScore), cb.desc(movieRoot.get(sort)));
            } else {
                query.orderBy(cb.desc(relevanceScore), cb.asc(movieRoot.get(sort)));
            }
        } else {
            query.orderBy(cb.desc(relevanceScore));  // Default to sorting by relevance if no sort field is specified
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
            Predicate likePredicate;
            if (queryString.equalsIgnoreCase("%")) {
                likePredicate = cb.like(countRoot.get("title"), "%");
            } else {
                likePredicate = cb.like(countRoot.get("title"), "%" + queryString + "%");
            }
            countTitlePredicates.add(likePredicate);
        }

        Predicate countTitlePredicate = cb.or(countTitlePredicates.toArray(new Predicate[0]));
        Predicate countLanguagePredicate;
        if (originalLanguage == null || originalLanguage.equalsIgnoreCase("")  || originalLanguage.equalsIgnoreCase("none")) {
            countLanguagePredicate = cb.like(countRoot.get("originalLanguage"), "%");
        } else {
            countLanguagePredicate = cb.equal(countRoot.get("originalLanguage"), originalLanguage);
        }

        Predicate countStatusPredicate;
        if (status == null || status.equalsIgnoreCase("") || status.equalsIgnoreCase("none")) {
            countStatusPredicate = cb.like(countRoot.get("status"), "%");
        } else {
            countStatusPredicate = cb.equal(cb.lower(countRoot.get("status")), status.toLowerCase());
        }

        // Predicate for delete flag
        Predicate countDeleteFlagPredicate = cb.equal(countRoot.get("deleteFlag"), false);

        // Apply the predicates to the count query
        if (genreId == null) {
            countQuery.select(cb.count(countRoot))
                    .where(cb.and(countTitlePredicate, countLanguagePredicate, countStatusPredicate, countDeleteFlagPredicate));
        } else {
            Join<Movie, Genre> countGenreJoin = countRoot.join("genres", JoinType.INNER);
            Predicate countGenrePredicate = cb.equal(countGenreJoin.get("id"), genreId);
            countQuery.select(cb.count(countRoot))
                    .where(cb.and(countTitlePredicate, countGenrePredicate, countLanguagePredicate,
                            countStatusPredicate, countDeleteFlagPredicate));
        }

        // Execute the count query
        Long totalCount = entityManager.createQuery(countQuery).getSingleResult();

        // Return a Page<Entity>
        return new PageImpl<>(resultList, pageable, totalCount);
    }
}
