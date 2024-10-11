package com.moonmovie.movie_service.services.Impl;

import com.moonmovie.movie_service.dao.AuditoriumDao;
import com.moonmovie.movie_service.dao.SeatDao;
import com.moonmovie.movie_service.models.Auditorium;
import com.moonmovie.movie_service.models.Seat;
import com.moonmovie.movie_service.services.AuditoriumService;
import com.moonmovie.movie_service.constants.SeatErrorConstants;
import com.moonmovie.movie_service.exceptions.SeatException;
import com.moonmovie.movie_service.response.PaginationResponse;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

@Service
@Slf4j
public class AuditoriumServiceImpl implements AuditoriumService {
    @Autowired
    private AuditoriumDao auditoriumDao;
    @Autowired
    private SeatDao seatDao;

    @Override
    @Transactional
    public Auditorium addAuditorium(Auditorium auditorium) {
        Optional<Auditorium> auditoriumOptional = auditoriumDao.findByName(auditorium.getName());
        if (auditoriumOptional.isPresent()) {
            throw new SeatException(SeatErrorConstants.ERROR_AUDITORIUM_ALREADY_EXISTS);
        }

        Auditorium auditoriumSaved = auditoriumDao.save(auditorium);
        List<String> nameRows = List.of("A", "B", "C", "D", "E", "F", "G", "H", "I", "K");
        List<Seat> seats = new ArrayList<>();
        for (int i = 0; i < 10; i++) {
            int numberSeatInRow = 14;
            if (nameRows.get(i).equals("A")) numberSeatInRow = 8;
            if (nameRows.get(i).equals("B") || nameRows.get(i).equals("K")) numberSeatInRow = 10;
            if (nameRows.get(i).equals("C") || nameRows.get(i).equals("D") || nameRows.get(i).equals("I")) numberSeatInRow = 12;
            for (int j = 0; j < numberSeatInRow; j++) {
                Seat seat = new Seat(null, nameRows.get(i), (j+1), auditoriumSaved);
                seats.add(seat);
            }
        }
        seatDao.saveAll(seats);
        return auditoriumSaved;
    }

    @Override
    @Transactional
    public Auditorium updateAuditorium(String auditoriumId, Auditorium auditorium) {
        Optional<Auditorium> auditoriumOptional = auditoriumDao.findById(auditoriumId);
        if (auditoriumOptional.isEmpty()) {
            throw new SeatException(SeatErrorConstants.ERROR_AUDITORIUM_NOT_EXISTS);
        } else {
            if (auditoriumDao.countByName(auditorium.getName()) == 1) {
                throw new SeatException(SeatErrorConstants.ERROR_AUDITORIUM_NAME_ALREADY_EXISTS);
            }
            auditoriumOptional.get().setName(auditorium.getName());
            auditoriumOptional.get().setAddress(auditorium.getAddress());
            return auditoriumDao.save(auditoriumOptional.get());
        }
    }

    @Override
    public List<String> getAvailableAuditoriums(int numAuditoriums) {
        Pageable pageable = PageRequest.of(0, numAuditoriums);
        Page<Auditorium> auditoriumPage = auditoriumDao.findAll(pageable);
        return auditoriumPage.getContent().stream().map(Auditorium::getId).toList();
    }

    public ResponseEntity<List<Auditorium>> fetchAllAuditoriums() {
        return new ResponseEntity<>(auditoriumDao.findAll(), HttpStatus.OK);
    }

    @Override
    public Auditorium getAuditoriumById(String id) {
        return auditoriumDao.findById(id).orElseThrow(() -> new SeatException(SeatErrorConstants.ERROR_AUDITORIUM_NOT_EXISTS));
    }

    @Override
    public PaginationResponse<Auditorium> getPaginationAuditorium(String q, String sort, String sortOrder, int size, int page) {
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

        Page<Auditorium> auditoriumPage;
        if ( q == null || q.isEmpty()) {
            auditoriumPage = auditoriumDao.findAll(pageable);
        } else {
            auditoriumPage = auditoriumDao.findAllByNameContainsIgnoreCase(q, pageable);
        }
        PaginationResponse<Auditorium> resp = PaginationResponse.<Auditorium>builder()
                .data(auditoriumPage.getContent())
                .page(page)
                .size(size)
                .totalPages(auditoriumPage.getTotalPages())
                .totalElements(auditoriumPage.getTotalElements())
                .build();
        return resp;
    }
}
