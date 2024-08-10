package com.moonmovie.movie_service.services.Impl;

import com.moonmovie.movie_service.constants.MovieErrorConstants;
import com.moonmovie.movie_service.dao.*;
import com.moonmovie.movie_service.dto.ShowingDto;
import com.moonmovie.movie_service.exceptions.MovieException;
import com.moonmovie.movie_service.helpers.DateTimeTransfer;
import com.moonmovie.movie_service.models.*;
import com.moonmovie.movie_service.requests.MovieRequest;
import com.moonmovie.movie_service.responses.PaginationResponse;
import com.moonmovie.movie_service.services.MovieService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.*;

@Service
public class MovieServiceImpl implements MovieService {

    @Autowired
    private MovieDao movieDao;

    @Autowired
    private GenreDao genreDao;

    @Autowired
    private DetailShowingTypeDao detailShowingTypeDao;

    @Autowired
    private GalleryDao galleryDao;

    @Autowired
    private DateTimeTransfer dateTimeTransfer;

    @Autowired
    private ShowingDao showingDao;

    @Override
    public PaginationResponse<Movie> getAllMovies(String query, int page, int size) {
        Pageable pageable = PageRequest.of(page - 1, size);
        Page<Movie> pageMovie;
        if (query.isEmpty()) {
            pageMovie  = movieDao.findAllByDeleteFlagIsFalse(pageable);
        } else {
            pageMovie = movieDao.findALlByDeleteFlagIsFalseAndTitleContainingIgnoreCase(query, pageable);
        }
        PaginationResponse<Movie> resp = PaginationResponse.<Movie>builder()
                .data(pageMovie.getContent())
                .page(page)
                .size(size)
                .totalPages(pageMovie.getTotalPages())
                .totalElements(pageMovie.getTotalElements())
                .build();
        return resp;
    }

    @Override
    public Movie getMovieById(int id) {
        return movieDao.findById(id).orElseThrow(() -> new MovieException(MovieErrorConstants.ERROR_MOVIE_NOT_EXISTS));
    }

    @Override
    @Transactional
    public Movie addMovie(MovieRequest request) {
        // if this month was scheduled change to next month
        try {
            if (showingDao.countByMonthAndYear(request.getMonthToSchedule(), request.getYearToSchedule()) > 0) {
                throw new MovieException(MovieErrorConstants.ERROR_THIS_MONTH_WAS_SCHEDULED);
            }
        } catch (Exception e) {
            e.printStackTrace();
        }


        // Check if max showings in the month
        int totalShowingsThisMonth = 0;
        try {
            totalShowingsThisMonth = movieDao.sumTotalShowings(request.getMonthToSchedule(), request.getYearToSchedule());
        } catch (Exception e) {
            e.printStackTrace();
        }

        if (totalShowingsThisMonth > 30 * 8 * 10) {
            throw new MovieException(MovieErrorConstants.ERROR_MAX_SHOWINGS_THIS_MONTH);
        }

        // Check if the movie has the same title
        if (movieDao.findByTitle(request.getTitle()).isPresent()) {
            throw new MovieException(MovieErrorConstants.ERROR_MOVIE_EXISTED);
        }

        Movie movie = convertMovieRequestToMovie(request);
        Movie moveSaved = movieDao.save(movie);

        // add galleries
        List<Gallery> galleriesSaved = new ArrayList<>();
        for (String imgUrl : request.getGalleries()) {
            Gallery g = new Gallery();
            g.setImgUrl(imgUrl);
            g.setMovie(movie);
            galleriesSaved.add(galleryDao.save(g));
        }

        List<DetailShowingType> detailShowingTypesSaved = new ArrayList<>();
        for (DetailShowingType detailShowingType : request.getDetailShowingTypes()) {
            detailShowingType.setMovie(movie);
            detailShowingTypeDao.save(detailShowingType);
        }

        moveSaved.setGalleries(galleriesSaved);
        moveSaved.setDetailShowingTypes(detailShowingTypesSaved);
        return moveSaved;
    }

    @Override
    @Transactional
    public Movie updateMovie(int id, MovieRequest request) {
        Optional<Movie> movie = movieDao.findById(id);
        if (movie.isPresent()) {
            movie.get().setTitle(request.getTitle());
            movie.get().setAdult(request.isAdult());
            movie.get().setBudget(request.getBudget());
            movie.get().setOriginalLanguage(request.getOriginalLanguage());
            movie.get().setOverview(request.getOverview());
            movie.get().setStatus(request.getStatus());
            movie.get().setVideo(request.getVideo());
            movie.get().setPosterPath(request.getPosterPath());
            movie.get().setBackdropPath(request.getBackdropPath());
            movie.get().setVoteAverage(request.getVoteAverage());
            movie.get().setVoteCount(request.getVoteCount());
            movie.get().setReleaseDate(request.getReleaseDate());

            List<Genre> genres = genreDao.findAllByIdIn(request.getGenreIds());
            Set<Genre> setGenres = new HashSet<>(genres);
            movie.get().setGenres(setGenres);

            Movie movieSaved = movieDao.save(movie.get());
            // update galleries
            List<Gallery> galleriesSaved = new ArrayList<>();
            for (String imgUrl : request.getGalleries()) {
                Gallery g = new Gallery();
                g.setImgUrl(imgUrl);
                g.setMovie(movieSaved);
                galleriesSaved.add(galleryDao.save(g));
            }
            galleryDao.deleteAllByMovieId(id);

            movieSaved.setGalleries(galleriesSaved);
            return movieSaved;
        }
        return null;
    }

    @Override
    @Transactional
    public Movie updateMovieScheduleDetail(int id, MovieRequest request) {
        Optional<Movie> movie = movieDao.findById(id);
        if (movie.isPresent()) {
            movie.get().setMonthToSchedule(request.getMonthToSchedule());
            movie.get().setYearToSchedule(request.getYearToSchedule());
            movie.get().setTotalShowings(request.getTotalShowings());
            List<DetailShowingType> detailShowingTypes = request.getDetailShowingTypes();
            movie.get().setDetailShowingTypes(detailShowingTypes);
            return movieDao.save(movie.get());
        }
        return null;
    }

    @Override
    @Transactional
    public List<Showing> schedule(int month, int year, String role) {
        if (!role.equalsIgnoreCase("ADMIN")) {
            throw new MovieException(MovieErrorConstants.ERROR_DO_NOT_HAVE_PERMISSION);
        }

        if (showingDao.countByMonthAndYear(month, year) > 0) {
            throw new MovieException(MovieErrorConstants.ERROR_THIS_MONTH_WAS_SCHEDULED);
        }

        final int restTime = 20;
        final int maxScreeningsPerDay = 7;
        LocalDateTime startDate = LocalDateTime.of(year, month, 1, 0, 0);
        // start at 6:00 am
        LocalDateTime startTimeToSchedule = dateTimeTransfer.calculateDatePlusHours(startDate, 6F);

        List<Movie> moviesToSchedule = movieDao.findAllByMonthToScheduleAndYearToSchedule(month, year);
        List<List<DetailShowingType>> detailShowingTypes = moviesToSchedule.stream().map(movie -> movie.getDetailShowingTypes()).toList();

        // synchronous -> use http/https request to get auditorium id
        // TODO replace this to a real call http to seat-service
        List<String> auditoriumIds = List.of("aud1", "ud2");

        List<AuditoriumState> auditoriumStates = new ArrayList<>();
        for (String auditoriumId : auditoriumIds) {
            AuditoriumState auditoriumState = new AuditoriumState(auditoriumId, startTimeToSchedule, 0);
            auditoriumStates.add(auditoriumState);
        }

        List<Showing> showings = new ArrayList<>();

        int indexAuditorium = 0;
        int screeningCount = 0;
        int breakState = 0;
        // dell choi cai giai thuat cu nua
        // mac du hoi cham hon nhung khoi ruom ra
        for (Movie movie : moviesToSchedule) {
            for (DetailShowingType detailShowingType : movie.getDetailShowingTypes()) {
                for (int i = 0; i < detailShowingType.getShowings(); i++) {

                    // if all auditorium are scheduled turn it to next date
                    if (screeningCount == auditoriumIds.size() * maxScreeningsPerDay) {
                        screeningCount = 0;
                        LocalDateTime nextDay = dateTimeTransfer.getNextDay(auditoriumStates.get(0).getLastScreeningsStartTime());
                        LocalDateTime newStartTime = dateTimeTransfer.calculateDatePlusHours(nextDay, 7F);
                        for (AuditoriumState auditoriumState : auditoriumStates) {
                            auditoriumState.setTotalScreeningsScheduled(0);
                            auditoriumState.setLastScreeningsStartTime(newStartTime);
                        }
                        indexAuditorium = 0;
                    }

                    // create object schedule
                    Showing showing = Showing.builder()
                            .type(detailShowingType.getName())
                            .startTime(auditoriumStates.get(indexAuditorium).getLastScreeningsStartTime())
                            .auditoriumId(auditoriumStates.get(indexAuditorium).getAuditoriumId())
                            .priceEachSeat(movie.getPriceEachSeat())
                            .movie(movie)
                            .build();

                    showings.add(showing);
                    screeningCount++;

                    //update auditorium state
                    LocalDateTime lScreeningStart = auditoriumStates.get(indexAuditorium).getLastScreeningsStartTime();
                    int movieDuration = movie.getRuntime();
                    auditoriumStates.get(indexAuditorium).setLastScreeningsStartTime(dateTimeTransfer.calculateDatePlusMinutes(lScreeningStart, movieDuration + restTime));
                    auditoriumStates.get(indexAuditorium).setTotalScreeningsScheduled(auditoriumStates.get(indexAuditorium).getTotalScreeningsScheduled() + 1);

                    // increase index to next auditorium
                    indexAuditorium++;
                    if (indexAuditorium == auditoriumIds.size()) {
                        indexAuditorium = 0;
                    }
                }
            }
        }

        return showingDao.saveAll(showings);
    }

    private Movie convertMovieRequestToMovie(MovieRequest movieRequest) {
        Movie movie = new Movie();
        movie.setTitle(movieRequest.getTitle());
        movie.setAdult(movieRequest.isAdult());
        movie.setBudget(movieRequest.getBudget());
        movie.setOriginalLanguage(movieRequest.getOriginalLanguage());
        movie.setOverview(movieRequest.getOverview());
        movie.setStatus(movieRequest.getStatus());
        movie.setVideo(movieRequest.getVideo());
        movie.setPosterPath(movieRequest.getPosterPath());
        movie.setBackdropPath(movieRequest.getBackdropPath());
        movie.setVoteAverage(movieRequest.getVoteAverage());
        movie.setVoteCount(movieRequest.getVoteCount());
        movie.setRuntime(movieRequest.getRuntime());
        movie.setReleaseDate(movieRequest.getReleaseDate());

        List<Genre> genres = genreDao.findAllByIdIn(movieRequest.getGenreIds());
        Set<Genre> setGenres = new HashSet<>(genres);
        movie.setGenres(setGenres);

        // set data for schedule
        movie.setMonthToSchedule(movieRequest.getMonthToSchedule());
        movie.setYearToSchedule(movieRequest.getYearToSchedule());
        movie.setTotalShowings(movieRequest.getTotalShowings());
        movie.setPriceEachSeat(movieRequest.getPriceEachSeat());

        return movie;
    }
}
