package com.moonmovie.movie_service.services.Impl;

import com.moonmovie.movie_service.dao.SeatDao;
import com.moonmovie.movie_service.dao.SeatDetailDao;
import com.moonmovie.movie_service.models.Seat;
import com.moonmovie.movie_service.models.SeatDetail;
import com.moonmovie.movie_service.requests.ChoosingSeatRequest;
import com.moonmovie.movie_service.requests.GenerateSeatDetailRequest;
import com.moonmovie.movie_service.response.ResponseMessage;
import com.moonmovie.movie_service.services.SeatDetailService;
import lombok.extern.slf4j.Slf4j;
import org.bson.types.ObjectId;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

@Service
@Slf4j
public class SeatDetailServiceImpl implements SeatDetailService {
    @Autowired
    private SeatDao seatDao;
    @Autowired
    private SeatDetailDao seatDetailDao;
    @Autowired
    private SimpMessagingTemplate messagingTemplate;

    public void sendDataToWebSocket(String destination, Object data) {
        messagingTemplate.convertAndSend(destination, data);
    }

    @Transactional
    public void generateSeatDetails(GenerateSeatDetailRequest request) {
        List<Seat> seats = seatDao.findByAuditoriumId(new ObjectId(request.getAuditoriumId()));
        List<SeatDetail> seatDetails = new ArrayList<>();
        for (Seat seatItem : seats) {
            SeatDetail seatDetail = SeatDetail.builder()
                    .price(request.getPrice())
                    .showingId(request.getShowingId())
                    .seat(seatItem)
                    .status("available")
                    .build();
            seatDetails.add(seatDetail);
        }
        seatDetailDao.saveAll(seatDetails);
    }

    public List<SeatDetail> getListSeatDetail(int showingId) {
        return seatDetailDao.findAllByShowingId(showingId);
    }

    @Transactional
    public void updateSeatStatus(ChoosingSeatRequest request) {
        Optional<SeatDetail> seatStatus = seatDetailDao.findById(request.getId());
        if (seatStatus.isPresent()) {
            if (request.getStatus().equals("booked")) {
                seatStatus.get().setStatus("booked");
                seatStatus.get().setUserId(request.getUsername());
                request.setStatus("booked");
                seatDetailDao.save(seatStatus.get());
                sendDataToWebSocket("/topic/seat-state", request);
            } else {
                if (seatStatus.get().getUserId().equals(request.getUsername())) {
                    if (request.getStatus().equals("choosing")) {
                        seatStatus.get().setStatus("available");
                        seatStatus.get().setUserId("");
                        request.setStatus("available");
                        seatDetailDao.save(seatStatus.get());
                        sendDataToWebSocket("/topic/seat-state", request);
                    }
                } else if (seatStatus.get().getUserId().isEmpty()) {
                    if (request.getStatus().equals("available")) {
                        seatStatus.get().setUserId(request.getUsername());
                        seatStatus.get().setStatus("choosing");
                        request.setStatus("choosing");
                        seatDetailDao.save(seatStatus.get());
                        sendDataToWebSocket("/topic/seat-state", request);
                    }
                }
            }
        }
    }

    @Transactional
    public ResponseEntity<ResponseMessage> refreshSeatState(List<String> listSeatIds) {
        ResponseMessage responseMessage = new ResponseMessage();
        List<SeatDetail> seatDetailList = seatDetailDao.findAllById(listSeatIds);
        seatDetailList.forEach(seatStatus -> {
            seatStatus.setStatus("available");
            seatStatus.setUserId("");
        });
        seatDetailDao.saveAll(seatDetailList);

        responseMessage.setMessage("Refresh state successfully!");
        return new ResponseEntity<>(responseMessage, HttpStatus.OK);
    }

    public List<SeatDetail> findAllSeatByIds(List<String> seatIds) {
        return seatDetailDao.findAllById(seatIds);
    }

    @Transactional
    public ResponseEntity<List<String>> checkoutSeat(List<ChoosingSeatRequest> requests) {
        List<String> listDisableIds = new ArrayList<>();
        for (ChoosingSeatRequest req : requests) {
            Optional<SeatDetail> seatStatus = seatDetailDao.findById(req.getId());
            if (seatStatus.isPresent()) {
                if (seatStatus.get().getUserId().isEmpty() && seatStatus.get().getStatus().equals("available")) {
                    seatStatus.get().setUserId(req.getUsername());
                    seatStatus.get().setStatus("choosing");
                    req.setStatus("choosing");
                    seatDetailDao.save(seatStatus.get());
                    sendDataToWebSocket("/topic/seat-state", seatStatus);
                } else {
                    listDisableIds.add(req.getId());
                }
            }
        }

        return new ResponseEntity<>(listDisableIds, HttpStatus.OK);
    }
}
