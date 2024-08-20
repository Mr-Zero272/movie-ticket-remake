package com.moonmovie.movie_service.services.Impl;

import com.moonmovie.movie_service.constants.MovieErrorConstants;
import com.moonmovie.movie_service.dao.*;
import com.moonmovie.movie_service.dto.ScheduleMovie;
import com.moonmovie.movie_service.exceptions.MovieException;
import com.moonmovie.movie_service.feign.SeatServiceInterface;
import com.moonmovie.movie_service.helpers.DateTimeTransfer;
import com.moonmovie.movie_service.kafka.KafkaMessage;
import com.moonmovie.movie_service.kafka.KafkaProducerService;
import com.moonmovie.movie_service.models.*;
import com.moonmovie.movie_service.requests.GenerateSeatDetailRequest;
import com.moonmovie.movie_service.requests.MovieRequest;
import com.moonmovie.movie_service.responses.PaginationResponse;
import com.moonmovie.movie_service.responses.ResponseTemplate;
import com.moonmovie.movie_service.responses.SuccessResponse;
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

    @Autowired
    private SeatServiceInterface seatServiceInterface;

    @Autowired
    private KafkaProducerService kafkaProducerService;

    @Override
    public PaginationResponse<Movie> getAllMovies(String query, int page, int size) {
        Pageable pageable = PageRequest.of(page - 1, size);
        Page<Movie> pageMovie;
        if (query.isEmpty()) {
            pageMovie = movieDao.findAllByDeleteFlagIsFalse(pageable);
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
    public PaginationResponse<Movie> getPopularMovies(int page, int size) {
        Pageable pageable = PageRequest.of(page - 1, size);
        Page<Movie> pageMovie  = movieDao.findAllByVoteCountGreaterThanEqual(200, pageable);

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
//        try {
//            if (showingDao.countByMonthAndYear(request.getMonthToSchedule(), request.getYearToSchedule()) > 0) {
//                throw new MovieException(MovieErrorConstants.ERROR_THIS_MONTH_WAS_SCHEDULED);
//            }
//        } catch (Exception e) {
//            e.printStackTrace();
//        }
//
//
//        // Check if max showings in the month
//        int totalShowingsThisMonth = 0;
//        try {
//            totalShowingsThisMonth = movieDao.sumTotalShowings(request.getMonthToSchedule(), request.getYearToSchedule());
//        } catch (Exception e) {
//            e.printStackTrace();
//        }
//
//        if (totalShowingsThisMonth > LocalDate.now().getMonthValue() * 8 * 10) {
//            throw new MovieException(MovieErrorConstants.ERROR_MAX_SHOWINGS_THIS_MONTH);
//        }
//
//        // Check if the movie has the same title
//        if (movieDao.findByTitle(request.getTitle()).isPresent()) {
//            throw new MovieException(MovieErrorConstants.ERROR_MOVIE_EXISTED);
//        }

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
    public ResponseTemplate schedule(int month, int year, String role) {
        if (!role.equalsIgnoreCase("ADMIN")) {
            throw new MovieException(MovieErrorConstants.ERROR_DO_NOT_HAVE_PERMISSION);
        }

        if (showingDao.countByMonthAndYear(month, year) > 0) {
            throw new MovieException(MovieErrorConstants.ERROR_THIS_MONTH_WAS_SCHEDULED);
        }

        List<Movie> movies = movieDao.findAllByMonthToScheduleAndYearToSchedule(month, year);

        // 28 -> 31 days
        final int totalDaysInThisMonth = LocalDate.now().lengthOfMonth();
        final int restTime = 20;
        final int maxScreeningsPerDay = 8;

        List<ScheduleMovie> scheduleMovieInfo = movies.stream().map(ScheduleMovie::new).toList();

        // synchronous -> use http/https request to get auditorium id
        List<String> auditoriumIds = new ArrayList<>();
        try {
            auditoriumIds = seatServiceInterface.getAvailableAuditorium(10).getBody();
        } catch (Exception e) {
            throw new MovieException(MovieErrorConstants.ERROR_SEAT_SERVICE_NOT_AVAILABLE);
        }

        List<List<AuditoriumState>> infoAuditoriumInThisMonth = new ArrayList<>();
        for (int i = 0; i < totalDaysInThisMonth; i++) {
            LocalDateTime startDateForAuditorium = LocalDateTime.of(year, month, i + 1, 6, 0);
            List<AuditoriumState> auditoriumStates = new ArrayList<>();
            for (String auditoriumId : auditoriumIds) {
                AuditoriumState auditoriumState = new AuditoriumState(auditoriumId, startDateForAuditorium, 0);
                auditoriumStates.add(auditoriumState);
            }
            infoAuditoriumInThisMonth.add(auditoriumStates);
        }

        List<Showing> showings = new ArrayList<>();

        // main movie schedule algorithm
        int totalMovieToSchedule = movies.size();
        for (int z = 0; z < totalMovieToSchedule; z++) {
            int totalDays = scheduleMovieInfo.get(z).getTotalDateShowingsInMonth();
            int showingsPerDay = scheduleMovieInfo.get(z).getTotalShowings() / totalDays;
            int remainingShowings = scheduleMovieInfo.get(z).getTotalShowings() % totalDays;
            int currentDate = 0;
            for (int i = 0; i < totalDays; i++) {
                int showingForToday = showingsPerDay;
                if (remainingShowings > 0) {
                    showingForToday++;
                    remainingShowings--;
                }

                int j = 0;
                int checkedAu = 0;
                while (showingForToday != 0) {
                    int showings2D = scheduleMovieInfo.get(z).getDetailShowingTypes().get(0).getShowings();
                    int showings2DSubtitles = scheduleMovieInfo.get(z).getDetailShowingTypes().get(1).getShowings();
                    int showings3D = scheduleMovieInfo.get(z).getDetailShowingTypes().get(2).getShowings();
                    int showings3DSubtitles = scheduleMovieInfo.get(z).getDetailShowingTypes().get(3).getShowings();


                    if (infoAuditoriumInThisMonth.get(currentDate).get(j).getTotalScreeningsScheduled() > maxScreeningsPerDay) {
                        if (checkedAu == 10) {
                            currentDate += 1;
                            checkedAu = 0;
                            continue;
                        }

                        if (j + 1 == 10) {
                            j = 0;
                        } else {
                            j += 1;
                        }

                        checkedAu += 1;
                        continue;
                    }

                    LocalDateTime lScreeningStart = infoAuditoriumInThisMonth.get(currentDate).get(j).getLastScreeningsStartTime();

                    if (showings2D > 0) {
                        scheduleMovieInfo.get(z).getDetailShowingTypes().get(0).setShowings(showings2D - 1);
                        Showing showing = Showing.builder()
                                .type(scheduleMovieInfo.get(z).getDetailShowingTypes().get(0).getName())
                                .startTime(lScreeningStart)
                                .auditoriumId(infoAuditoriumInThisMonth.get(currentDate).get(j).getAuditoriumId())
                                .priceEachSeat(scheduleMovieInfo.get(z).getPriceEachSeat())
                                .movie(movies.get(z))
                                .build();
                        showings.add(showing);

                        infoAuditoriumInThisMonth.get(currentDate).get(j).setLastScreeningsStartTime(dateTimeTransfer.calculateDatePlusMinutes(lScreeningStart, movies.get(z).getRuntime() + restTime));
                        infoAuditoriumInThisMonth.get(currentDate).get(j).setTotalScreeningsScheduled(infoAuditoriumInThisMonth.get(currentDate).get(j).getTotalScreeningsScheduled() + 1);

                        showingForToday--;

                        continue;
                    }

                    if (showings2DSubtitles > 0) {
                        scheduleMovieInfo.get(z).getDetailShowingTypes().get(1).setShowings(showings2DSubtitles - 1);
                        Showing showing = Showing.builder()
                                .type(scheduleMovieInfo.get(z).getDetailShowingTypes().get(1).getName())
                                .startTime(lScreeningStart)
                                .auditoriumId(infoAuditoriumInThisMonth.get(currentDate).get(j).getAuditoriumId())
                                .priceEachSeat(scheduleMovieInfo.get(z).getPriceEachSeat())
                                .movie(movies.get(z))
                                .build();
                        showings.add(showing);

                        infoAuditoriumInThisMonth.get(currentDate).get(j).setLastScreeningsStartTime(dateTimeTransfer.calculateDatePlusMinutes(lScreeningStart, movies.get(z).getRuntime() + restTime));
                        infoAuditoriumInThisMonth.get(currentDate).get(j).setTotalScreeningsScheduled(infoAuditoriumInThisMonth.get(currentDate).get(j).getTotalScreeningsScheduled() + 1);

                        showingForToday--;

                        continue;
                    }

                    if (showings3D > 0) {
                        scheduleMovieInfo.get(z).getDetailShowingTypes().get(2).setShowings(showings3D - 1);
                        Showing showing = Showing.builder()
                                .type(scheduleMovieInfo.get(z).getDetailShowingTypes().get(2).getName())
                                .startTime(lScreeningStart)
                                .auditoriumId(infoAuditoriumInThisMonth.get(currentDate).get(j).getAuditoriumId())
                                .priceEachSeat(scheduleMovieInfo.get(z).getPriceEachSeat())
                                .movie(movies.get(z))
                                .build();
                        showings.add(showing);

                        infoAuditoriumInThisMonth.get(currentDate).get(j).setLastScreeningsStartTime(dateTimeTransfer.calculateDatePlusMinutes(lScreeningStart, movies.get(z).getRuntime() + restTime));
                        infoAuditoriumInThisMonth.get(currentDate).get(j).setTotalScreeningsScheduled(infoAuditoriumInThisMonth.get(currentDate).get(j).getTotalScreeningsScheduled() + 1);

                        showingForToday--;

                        continue;
                    }

                    if (showings3DSubtitles > 0) {
                        scheduleMovieInfo.get(z).getDetailShowingTypes().get(3).setShowings(showings3DSubtitles - 1);
                        Showing showing = Showing.builder()
                                .type(scheduleMovieInfo.get(z).getDetailShowingTypes().get(3).getName())
                                .startTime(lScreeningStart)
                                .auditoriumId(infoAuditoriumInThisMonth.get(currentDate).get(j).getAuditoriumId())
                                .priceEachSeat(scheduleMovieInfo.get(z).getPriceEachSeat())
                                .movie(movies.get(z))
                                .build();
                        showings.add(showing);

                        infoAuditoriumInThisMonth.get(currentDate).get(j).setLastScreeningsStartTime(dateTimeTransfer.calculateDatePlusMinutes(lScreeningStart, movies.get(z).getRuntime() + restTime));
                        infoAuditoriumInThisMonth.get(currentDate).get(j).setTotalScreeningsScheduled(infoAuditoriumInThisMonth.get(currentDate).get(j).getTotalScreeningsScheduled() + 1);

                        showingForToday--;
                    }

                }

                if (currentDate + 1 == totalDaysInThisMonth) {
                    currentDate = 0;
                } else {
                    currentDate += 1;
                }
            }
        }

        // end movie schedule algorithm
        List<Showing> showingsSaved = showingDao.saveAll(showings);
        showingsSaved.forEach(showing -> {
            KafkaMessage<GenerateSeatDetailRequest> message = KafkaMessage.<GenerateSeatDetailRequest>builder()
                    .event("generate seat detail")
                    .timestamp(LocalDateTime.now())
                    .data(new GenerateSeatDetailRequest(showing.getId(), showing.getAuditoriumId(), showing.getPriceEachSeat()))
                    .build();
            kafkaProducerService.sendMessageGenerateSeatDetail("seat-generate", message);
        });
        return new ResponseTemplate("Schedule successfully!");
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
        movie.setTotalDateShowingsInMonth(movieRequest.getTotalDateShowingsInMonth());
        movie.setYearToSchedule(movieRequest.getYearToSchedule());
        movie.setTotalShowings(movieRequest.getTotalShowings());
        movie.setPriceEachSeat(movieRequest.getPriceEachSeat());

        return movie;
    }
}
