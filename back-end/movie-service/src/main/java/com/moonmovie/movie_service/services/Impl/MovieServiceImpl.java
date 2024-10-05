package com.moonmovie.movie_service.services.Impl;

import com.moonmovie.movie_service.constants.MovieErrorConstants;
import com.moonmovie.movie_service.dao.*;
import com.moonmovie.movie_service.dto.MovieDto;
import com.moonmovie.movie_service.dto.ScheduleMovie;
import com.moonmovie.movie_service.exceptions.GlobalException;
import com.moonmovie.movie_service.feign.SeatServiceInterface;
import com.moonmovie.movie_service.helpers.DateTimeTransfer;
import com.moonmovie.movie_service.kafka.KafkaMessage;
import com.moonmovie.movie_service.kafka.KafkaProducerService;
import com.moonmovie.movie_service.models.*;
import com.moonmovie.movie_service.requests.GenerateSeatDetailRequest;
import com.moonmovie.movie_service.requests.MovieRequest;
import com.moonmovie.movie_service.responses.PaginationResponse;
import com.moonmovie.movie_service.responses.ResponseTemplate;
import com.moonmovie.movie_service.services.MovieService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.lang.reflect.Field;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.YearMonth;
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

    @Autowired
    private MovieDaoCustom movieDaoCustom;

    @Override
    public PaginationResponse<Movie> getAllMovies(String query, Integer genreId, String originalLanguage, String status, String sort, String sortOrder, int page, int size) {
        if (genreId != null && genreId == 0) genreId = null;
        List<String> queries = new ArrayList<>();
        queries.add(query);
        if (query == null || query.isEmpty()) {
            queries = List.of("%");
        } else {
            queries = Arrays.stream(query.split(" ")).toList();
        }
        Pageable pageable = PageRequest.of(page - 1, size);
        Page<Movie> pageMovie = movieDaoCustom.findAllWithFilters(queries, genreId, originalLanguage, status, sort, sortOrder, pageable);
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
    public PaginationResponse<Movie> getPopularMovies(int page, int size, String sort, Integer genreId) {
        Pageable pageable;
        if (sort.equalsIgnoreCase("none")) {
            pageable = PageRequest.of(page - 1, size);
        } else {
            pageable = PageRequest.of(page - 1, size, Sort.by(Sort.Direction.DESC, sort));
        }

        Page<Movie> pageMovie;
        if (genreId == null || genreId == 0) {
            pageMovie = movieDao.findAllByVoteCountGreaterThanEqual(100, pageable);
        } else {
            pageMovie = movieDao.findAllByVoteCountGreaterThanEqualAndGenreIs(100, genreId, pageable);
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
        return movieDao.findById(id).orElseThrow(() -> new GlobalException(MovieErrorConstants.ERROR_MOVIE_NOT_EXISTS));
    }

    @Override
    @Transactional
    public Movie addMovie(MovieRequest request) {
        // if this month was scheduled change to next month
        try {
            if (showingDao.countByMonthAndYear(request.getMonthToSchedule(), request.getYearToSchedule()) > 0) {
                throw new GlobalException(MovieErrorConstants.ERROR_THIS_MONTH_WAS_SCHEDULED);
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

        if (totalShowingsThisMonth > LocalDate.now().lengthOfMonth() * 8 * 10) {
            throw new GlobalException(MovieErrorConstants.ERROR_MAX_SHOWINGS_THIS_MONTH);
        }

        // Check if the movie has the same title
        if (movieDao.findByTitle(request.getTitle()).isPresent()) {
            throw new GlobalException(MovieErrorConstants.ERROR_MOVIE_EXISTED);
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
        Movie movie = movieDao.findById(id).orElseThrow(() -> new GlobalException(MovieErrorConstants.ERROR_MOVIE_NOT_EXIST));
        List<String> fieldsSkip = List.of("genreIds", "galleries", "detailShowingTypes");
        for (Field updateField : request.getClass().getDeclaredFields()) {
            updateField.setAccessible(true);
            try {
                if (fieldsSkip.contains(updateField.getName())) continue;
                Object value = updateField.get(request);
                if (value != null) {
                    try {
                        Field entityField = movie.getClass().getDeclaredField(updateField.getName());
                        entityField.setAccessible(true);
                        entityField.set(movie, value);
                    } catch (NoSuchFieldException e) {
                        // Handle the case where the field does not exist in the User entity
                        System.out.println("Field " + updateField.getName() + " does not exist in Movie entity, skipping...");
                    }
                }
            } catch (IllegalAccessException e) {
                throw new RuntimeException(e);
            }
        }

        // update genre
        Set<Genre> genres = new HashSet<>(genreDao.findAllByIdIn(request.getGenreIds()));
        movie.setGenres(genres);

        for (int i = 0; i < request.getDetailShowingTypes().size(); i++) {
            movie.getDetailShowingTypes().get(i).setShowings(request.getDetailShowingTypes().get(i).getShowings());
        }

        // update galleries
        List<Gallery> newGalleries = new ArrayList<>();
        for (String gallery : request.getGalleries()) {
            Gallery g = new Gallery();
            g.setImgUrl(gallery);
            g.setMovie(movie);
            newGalleries.add(galleryDao.save(g));
        }

        movie.getGalleries().clear();
        movie.getGalleries().addAll(newGalleries);
        Movie movieSaved = movieDao.save(movie);

        return movieSaved;
    }

    @Override
    public void deleteMovie(int id) {
        Movie movie = movieDao.findById(id).orElseThrow(() -> new GlobalException(MovieErrorConstants.ERROR_MOVIE_NOT_EXIST));
        movieDao.delete(movie);
    }

    @Override
    @Transactional
    public Movie updateMovieScheduleDetail(int id, MovieRequest request) {
        Movie movie = movieDao.findById(id).orElseThrow(() -> new GlobalException(MovieErrorConstants.ERROR_MOVIE_NOT_EXIST));

        movie.setMonthToSchedule(request.getMonthToSchedule());
        movie.setYearToSchedule(request.getYearToSchedule());
        movie.setTotalShowings(request.getTotalShowings());
        movie.setTotalDateShowingsInMonth(request.getTotalDateShowingsInMonth());
        movie.setPriceEachSeat(request.getPriceEachSeat());
        for (int i = 0; i < 4; i++) {
            movie.getDetailShowingTypes().get(i).setShowings(request.getDetailShowingTypes().get(i).getShowings());
        }
        return movieDao.save(movie);
    }

    @Override
    @Transactional
    public ResponseTemplate schedule(int month, int year, String role) {
        if (!role.equalsIgnoreCase("ADMIN")) {
            throw new GlobalException(MovieErrorConstants.ERROR_DO_NOT_HAVE_PERMISSION);
        }

        if (showingDao.countByMonthAndYear(month, year) > 0) {
            throw new GlobalException(MovieErrorConstants.ERROR_THIS_MONTH_WAS_SCHEDULED);
        }

        List<Movie> movies = movieDao.findAllByMonthToScheduleAndYearToSchedule(month, year);

        // 28 -> 31 days
        YearMonth yearMonthObject = YearMonth.of(year, month);
        final int totalDaysInThisMonth = yearMonthObject.lengthOfMonth();
        final int restTime = 20;
        final int maxScreeningsPerDay = 8;

        List<ScheduleMovie> scheduleMovieInfo = movies.stream().map(ScheduleMovie::new).toList();

        // synchronous -> use http/https request to get auditorium id
        List<String> auditoriumIds = new ArrayList<>();
        try {
            auditoriumIds = seatServiceInterface.getAvailableAuditorium(10).getBody();
        } catch (Exception e) {
            throw new GlobalException(MovieErrorConstants.ERROR_SEAT_SERVICE_NOT_AVAILABLE);
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

    @Override
    public PaginationResponse<Movie> getUpcomingMovies(int page, int size) {
        Pageable pageable = PageRequest.of(page - 1, size);
        Page<Movie> pageMovie = movieDao.findAllByStatus("Upcoming", pageable);

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
    public MovieDto getMovieByShowingId(int showingId) {
        Showing showing = showingDao.findById(showingId).orElseThrow(() -> new GlobalException(MovieErrorConstants.ERROR_SHOWING_NOT_EXISTS));
        return convertMovieToMovieDto(showing.getMovie());
    }

    private MovieDto convertMovieToMovieDto(Movie movie) {
        return MovieDto.builder()
                .id(movie.getId())
                .title(movie.getTitle())
                .adult(movie.isAdult())
                .budget(movie.getBudget())
                .originalLanguage(movie.getOriginalLanguage())
                .overview(movie.getOverview())
                .status(movie.getStatus())
                .video(movie.getVideo())
                .posterPath(movie.getPosterPath())
                .backdropPath(movie.getBackdropPath())
                .voteAverage(movie.getVoteAverage())
                .voteCount(movie.getVoteCount())
                .runtime(movie.getRuntime())
                .releaseDate(movie.getReleaseDate())
                .deleteFlag(movie.isDeleteFlag())
                .build();
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
