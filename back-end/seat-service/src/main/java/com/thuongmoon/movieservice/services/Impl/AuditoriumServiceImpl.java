package com.thuongmoon.movieservice.services.Impl;

import com.thuongmoon.movieservice.constants.SeatErrorConstants;
import com.thuongmoon.movieservice.dao.AuditoriumDao;
import com.thuongmoon.movieservice.dao.SeatDao;
import com.thuongmoon.movieservice.exceptions.SeatException;
import com.thuongmoon.movieservice.models.Auditorium;
import com.thuongmoon.movieservice.models.Seat;
import com.thuongmoon.movieservice.response.Pagination;
import com.thuongmoon.movieservice.response.PaginationResponse;
import com.thuongmoon.movieservice.response.ResponsePagination;
import com.thuongmoon.movieservice.services.AuditoriumService;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
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
        List<String> nameRows = List.of("A", "B", "C", "D", "E", "F", "G", "H", "I", "K", "L", "M");
        List<Seat> seats = new ArrayList<>();
        for (int i = 0; i < 12; i++) {
            int numberSeatInRow = 10;
            if (nameRows.get(i).equals("A")) numberSeatInRow = 6;
            if (nameRows.get(i).equals("B")) numberSeatInRow = 8;
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

    public ResponseEntity<List<String>> provideAuditoriumNeed(Integer numAuditoriums, LocalDateTime startDate) {
        return null;
    }

    public ResponseEntity<List<Auditorium>> fetchAllAuditoriums() {
        return new ResponseEntity<>(auditoriumDao.findAll(), HttpStatus.OK);
    }

    @Override
    public Auditorium getAuditoriumById(String id) {
        return auditoriumDao.findById(id).orElseThrow(() -> new SeatException(SeatErrorConstants.ERROR_AUDITORIUM_NOT_EXISTS));
    }

    @Override
    public PaginationResponse<Auditorium> getPaginationAuditorium(String q, int size, int page) {
        Pageable pageable = PageRequest.of(page - 1, size);
        Page<Auditorium> auditoriumPage;
        if ( q == null || q.isEmpty()) {
            auditoriumPage = auditoriumDao.findAll(pageable);
        } else {
            auditoriumPage = auditoriumDao.findAllByName(pageable, q);
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
