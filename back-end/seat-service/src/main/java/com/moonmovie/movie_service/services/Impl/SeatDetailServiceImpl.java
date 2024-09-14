package com.moonmovie.movie_service.services.Impl;

import com.moonmovie.movie_service.dao.SeatDao;
import com.moonmovie.movie_service.dao.SeatDetailDao;
import com.moonmovie.movie_service.dto.SeatDetailDto;
import com.moonmovie.movie_service.models.Seat;
import com.moonmovie.movie_service.models.SeatDetail;
import com.moonmovie.movie_service.requests.ChoosingSeatRequest;
import com.moonmovie.movie_service.requests.GenerateSeatDetailRequest;
import com.moonmovie.movie_service.response.ResponseMessage;
import com.moonmovie.movie_service.response.ResponseTemplate;
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
                seatStatus.get().setUserId(request.getUserId());
                request.setStatus("booked");
                seatDetailDao.save(seatStatus.get());
                sendDataToWebSocket("/topic/seat-state", request);
            } else {
                if (seatStatus.get().getUserId().equals(request.getUserId())) {
                    if (request.getStatus().equals("choosing")) {
                        seatStatus.get().setStatus("available");
                        seatStatus.get().setUserId("");
                        request.setStatus("available");
                        seatDetailDao.save(seatStatus.get());
                        sendDataToWebSocket("/topic/seat-state", request);
                    }
                } else if (seatStatus.get().getUserId().isEmpty()) {
                    if (request.getStatus().equals("available")) {
                        seatStatus.get().setUserId(request.getUserId());
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
    public ResponseTemplate refreshSeatState(int showingId, String userId){
        ResponseTemplate res = new ResponseTemplate();
        List<SeatDetail> seatDetailList = seatDetailDao.findAllByShowingIdAndUserIdAndStatus(showingId, userId, "choosing");
        seatDetailList.forEach(seatStatus -> {
            seatStatus.setStatus("available");
            seatStatus.setUserId("");
        });
        seatDetailDao.saveAll(seatDetailList);

        res.setMessage("Refresh state successfully!");
        return res;
    }

    public List<SeatDetail> findAllSeatByIds(List<String> seatIds) {
        return seatDetailDao.findAllById(seatIds);
    }

    @Override
    @Transactional
    public List<String> checkoutSeat(List<String> seatIds) {
        List<SeatDetail> seatDetails = seatDetailDao.findAllById(seatIds);
        seatDetails.forEach(seatDetail -> seatDetail.setStatus("booked"));
        seatDetails.forEach(seatDetail -> {
            ChoosingSeatRequest request = new ChoosingSeatRequest();
            request.setId(seatDetail.getId());
            request.setUserId(seatDetail.getUserId());
            request.setStatus(seatDetail.getStatus());
            sendDataToWebSocket("/topic/seat-state", request);
        });
        seatDetailDao.saveAll(seatDetails);
        return seatIds;
    }

    @Override
    public List<SeatDetailDto> getListSeatDetailDto(int showingId, String userId) {
        List<SeatDetail> seatDetails = seatDetailDao.findAllByShowingIdAndUserIdAndStatus(showingId, userId, "choosing");
        List<SeatDetailDto> seatDetailDtos = new ArrayList<>();
        for (SeatDetail seatDetail : seatDetails) {
            seatDetailDtos.add(convertSeatDetailToSeatDetailDto(seatDetail));
        }
        return seatDetailDtos;
    }

    private SeatDetailDto convertSeatDetailToSeatDetailDto(SeatDetail seatDetail) {
        return SeatDetailDto.builder()
                .id(seatDetail.getId())
                .seatRow(seatDetail.getSeat().getRowSeat())
                .seatNumber(seatDetail.getSeat().getNumberSeat())
                .price(seatDetail.getPrice())
                .hall(seatDetail.getSeat().getAuditorium().getName())
                .address(seatDetail.getSeat().getAuditorium().getAddress())
                .build();
    }
}
