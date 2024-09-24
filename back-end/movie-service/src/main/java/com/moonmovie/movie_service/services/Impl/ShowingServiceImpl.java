package com.moonmovie.movie_service.services.Impl;

import com.moonmovie.movie_service.constants.MovieErrorConstants;
import com.moonmovie.movie_service.dao.ShowingDao;
import com.moonmovie.movie_service.dto.ShowingDto;
import com.moonmovie.movie_service.exceptions.GlobalException;
import com.moonmovie.movie_service.helpers.DateTimeTransfer;
import com.moonmovie.movie_service.kafka.KafkaMessage;
import com.moonmovie.movie_service.kafka.KafkaProducerService;
import com.moonmovie.movie_service.models.Movie;
import com.moonmovie.movie_service.models.Showing;
import com.moonmovie.movie_service.requests.AddShowingRequest;
import com.moonmovie.movie_service.requests.GenerateSeatDetailRequest;
import com.moonmovie.movie_service.requests.UpdateShowingTimeAndAuditoriumRequest;
import com.moonmovie.movie_service.responses.PaginationResponse;
import com.moonmovie.movie_service.services.MovieService;
import com.moonmovie.movie_service.services.ShowingService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.Date;
import java.util.List;

@Service
public class ShowingServiceImpl implements ShowingService {

    @Autowired
    private ShowingDao showingDao;

    @Autowired
    private DateTimeTransfer dateTimeTransfer;

    @Autowired
    private MovieService movieService;

    @Autowired
    private KafkaProducerService kafkaProducerService;

    @Override
    public Showing addShowing(Showing showing) {
        return showingDao.save(showing);
    }

    @Override
    public List<ShowingDto> getAllShowings(LocalDateTime startDate, int movieId) {
        List<ShowingDto> showings = showingDao.findAllByStartTimeGreaterThanEqualAndDateIsAndMovieIdIs(startDate, startDate.getDayOfMonth(), movieId);
        return showings;
    }

    @Override
    public Showing getShowing(int showingId) {
        return showingDao.findById(showingId).orElseThrow(() -> new GlobalException(MovieErrorConstants.ERROR_SHOWING_NOT_EXISTS));
    }

    @Override
    public PaginationResponse<Showing> getPaginationShowings(String query, LocalDateTime date, Integer genreId, String type, int page, int size) {
        Pageable pageable = PageRequest.of(page - 1, size);
        Page<Showing> pageShowing;
        query = "%" + query + "%";

        if (genreId == 0 && type.equalsIgnoreCase("")) {
            pageShowing = showingDao.findAllByTitleLikeAndDateEqual(query, date, pageable);
        } else if (genreId == 0 && !type.equalsIgnoreCase("")) {
            pageShowing = showingDao.findAllByTitleLikeAndDateEqualAndTypeEqualIgnoreCase(query, date, type, pageable);
        } else if (genreId != 0 && type.equalsIgnoreCase("")) {
            pageShowing = showingDao.findAllByTitleLikeAndDateEqualAndGenreEqual(query, date, genreId, pageable);
        } else if (genreId != 0 && !type.equalsIgnoreCase("")) {
            pageShowing = showingDao.findAllByTitleLikeAndDateEqualAndGenreEqualAndTypeEqualIgnoreCase(query, date, genreId, type, pageable);
        } else {
            pageShowing = showingDao.findAll(pageable);
        }

        PaginationResponse<Showing> resp = PaginationResponse.<Showing>builder()
                .data(pageShowing.getContent())
                .page(page)
                .size(size)
                .totalPages(pageShowing.getTotalPages())
                .totalElements(pageShowing.getTotalElements())
                .build();
        return resp;
    }

    @Override
    public List<ShowingDto> getShowingsByDateAndAuditorium(LocalDate date, String auditoriumId) {
        return showingDao.findAllByStartTimeAndAuditoriumIdIsOrderAscConvertShowingDto(date, auditoriumId);
    }

    @Override
    @Transactional
    public Showing updateShowingTimeAndAuditorium(UpdateShowingTimeAndAuditoriumRequest request) {
        Showing showing = showingDao.findById(request.getShowingId()).orElseThrow(() -> new GlobalException(MovieErrorConstants.ERROR_SHOWING_NOT_EXISTS));
        int oldTotalShowing = showingDao.countByStartTimeAndAuditoriumIdIsOrderAsc(request.getOldDate(), request.getOldAuditoriumId());
        int totalShowing = showingDao.countByStartTimeAndAuditoriumIdIsOrderAsc(request.getNewDate(), request.getNewAuditoriumId());
        if (totalShowing >= 10) {
            throw new GlobalException(400, "The number of screenings at this theater on this day has reached its limit.");
        }

        // update old data
        if (request.getOldPosition() < oldTotalShowing) {
            List<Showing> oldShowings = showingDao.findAllByStartTimeAndAuditoriumIdIsOrderAsc(request.getOldDate(), request.getOldAuditoriumId());
            if (request.getOldPosition() == 1) {
                List<Showing> showingNeedChange = oldShowings.subList(1, oldShowings.size());
                showingDao.saveAll(editShowingTime(showingNeedChange, dateTimeTransfer.transperStrToLocalDateTime(request.getOldDate() + " 06:00")));
            } else {
                List<Showing> showingNeedChange = oldShowings.subList(request.getOldPosition(), oldShowings.size());
                showingDao.saveAll(editShowingTime(showingNeedChange, showing.getStartTime()));
            }
        }

        // end update old data

        LocalDateTime startTime;
        List<Showing> showings = showingDao.findAllByStartTimeAndAuditoriumIdIsOrderAsc(request.getNewDate(), request.getNewAuditoriumId());
        if (request.getNewPosition() <= totalShowing ) {
            startTime = showings.get(request.getNewPosition() - 1).getStartTime();
            showing.setStartTime(startTime);
            showing.setAuditoriumId(request.getNewAuditoriumId());

            LocalDateTime endTimeOfNewShowing = dateTimeTransfer.calculateDatePlusMinutes(startTime, showing.getMovie().getRuntime() + 20);
            List<Showing> showingNeedChange = showings.subList(request.getNewPosition() - 1, showings.size());
            showingDao.saveAll(editShowingTime(showingNeedChange, endTimeOfNewShowing));
            return showingDao.save(showing);
        } else {
            startTime = dateTimeTransfer.calculateDatePlusMinutes(showings.get(totalShowing - 1).getStartTime(), showings.get(totalShowing - 1).getMovie().getRuntime());
            showing.setStartTime(startTime);
            showing.setAuditoriumId(request.getNewAuditoriumId());
            return showingDao.save(showing);
        }
    }

    @Override
    public Showing addShowing(AddShowingRequest request) {
        int totalShowing = showingDao.countByStartTimeAndAuditoriumIdIsOrderAsc(request.getDate(), request.getAuditoriumId());
        if (totalShowing >= 10) {
            throw new GlobalException(400, "The number of screenings at this theater on this day has reached its limit.");
        }

        Movie movie = movieService.getMovieById(request.getMovieId());
        List<Showing> showings = showingDao.findAllByStartTimeAndAuditoriumIdIsOrderAsc(request.getDate(), request.getAuditoriumId());

        if (request.getPosition() == totalShowing + 1) {
            Showing showing = Showing.builder()
                    .startTime(dateTimeTransfer.calculateDatePlusMinutes(showings.get(showings.size() - 1).getStartTime(), showings.get(showings.size() - 1).getMovie().getRuntime() + 20))
                    .auditoriumId(request.getAuditoriumId())
                    .priceEachSeat(movie.getPriceEachSeat())
                    .type(request.getType())
                    .movie(movie)
                    .build();
            Showing savedShowing = showingDao.save(showing);
            generateSeatForShowing(savedShowing);
            return savedShowing;
        }

        Showing showing = new Showing();
        LocalDateTime startTime = showings.get(request.getPosition() - 1).getStartTime();
        showing.setStartTime(startTime);
        showing.setAuditoriumId(request.getAuditoriumId());
        showing.setPriceEachSeat(movie.getPriceEachSeat());
        showing.setType(request.getType());
        showing.setMovie(movie);

        LocalDateTime endTimeOfNewShowing = dateTimeTransfer.calculateDatePlusMinutes(startTime, showing.getMovie().getRuntime() + 20);
        List<Showing> showingNeedChange = showings.subList(request.getPosition() - 1, showings.size());
        showingDao.saveAll(editShowingTime(showingNeedChange, endTimeOfNewShowing));
        Showing savedShowing = showingDao.save(showing);
        generateSeatForShowing(savedShowing);
        return savedShowing;
    }

    private List<Showing> editShowingTime(List<Showing> showings, LocalDateTime startTime) {
        for(Showing showing: showings) {
            showing.setStartTime(startTime);
            startTime = dateTimeTransfer.calculateDatePlusMinutes(startTime, showing.getMovie().getRuntime() + 20);
        }
        return showings;
    }

    private void generateSeatForShowing(Showing showing) {
        KafkaMessage<GenerateSeatDetailRequest> message = KafkaMessage.<GenerateSeatDetailRequest>builder()
                .event("generate seat detail")
                .timestamp(LocalDateTime.now())
                .data(new GenerateSeatDetailRequest(showing.getId(), showing.getAuditoriumId(), showing.getPriceEachSeat()))
                .build();
        kafkaProducerService.sendMessageGenerateSeatDetail("seat-generate", message);
    }
}
