package com.moonmovie.movie_service.services.Impl;

import com.moonmovie.movie_service.dao.SeatDao;
import com.moonmovie.movie_service.dao.SeatDetailDao;
import com.moonmovie.movie_service.exceptions.SeatException;
import com.moonmovie.movie_service.models.Seat;
import com.moonmovie.movie_service.models.SeatDetail;
import com.moonmovie.movie_service.requests.UpdateSeatRequest;
import com.moonmovie.movie_service.services.SeatService;
import lombok.extern.slf4j.Slf4j;
import org.bson.types.ObjectId;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@Slf4j
public class SeatServiceImpl implements SeatService {
    @Autowired
    private SeatDao seatDao;

    @Autowired
    private SeatDetailDao seatDetailDao;

    @Override
    public List<Seat> getSeatsByAuditoriumId(ObjectId auditoriumId) {
        return seatDao.findByAuditoriumId(auditoriumId);
    }

    @Override
    @Transactional
    public Seat updateSeat(String seatId, UpdateSeatRequest request) {
        Seat seat = seatDao.findById(seatId).orElseThrow(() -> new SeatException(400, "This seat id does not exists!"));
        seat.setStatus(request.getStatus());
        List<SeatDetail> seatDetailList = seatDetailDao.findAllBySeatId(new ObjectId(seatId));
        seatDetailList.forEach(seatDetail -> {
            if ((seatDetail.getUserId() == null || seatDetail.getUserId().isEmpty()) && seatDetail.getStatus().equalsIgnoreCase("available") && request.getStatus().equalsIgnoreCase("problem")) {
                    seatDetail.setStatus("booked");
                    seatDetail.setUserId("admin");
            } else if (seatDetail.getUserId() != null && seatDetail.getUserId().equalsIgnoreCase("admin") && seatDetail.getStatus().equalsIgnoreCase(
                    "booked") && request.getStatus().equalsIgnoreCase("normal")) {
                seatDetail.setStatus("available");
                seatDetail.setUserId("");
            }
        });

        seatDetailDao.saveAll(seatDetailList);
        return seatDao.save(seat);
    }
}
