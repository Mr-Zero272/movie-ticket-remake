package com.moonmovie.movie_service.services.Impl;

import com.moonmovie.movie_service.dao.SeatDao;
import com.moonmovie.movie_service.dao.SeatDetailDao;
import com.moonmovie.movie_service.dto.SeatDetailDto;
import com.moonmovie.movie_service.exceptions.SeatException;
import com.moonmovie.movie_service.kafka.KafkaProducerService;
import com.moonmovie.movie_service.models.Seat;
import com.moonmovie.movie_service.models.SeatDetail;
import com.moonmovie.movie_service.requests.*;
import com.moonmovie.movie_service.response.ResponseTemplate;
import com.moonmovie.movie_service.services.SeatDetailService;
import lombok.extern.slf4j.Slf4j;
import org.bson.types.ObjectId;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.time.temporal.ChronoUnit;
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
    @Autowired
    private KafkaProducerService kafkaProducerService;

    public void sendDataToWebSocket(String destination, Object data) {
        messagingTemplate.convertAndSend(destination, data);
    }

    @Transactional
    public void generateSeatDetails(GenerateSeatDetailRequest request) {
        List<Seat> seats = seatDao.findByAuditoriumId(new ObjectId(request.getAuditoriumId()));
        List<SeatDetail> seatDetails = new ArrayList<>();
        for (Seat seatItem : seats) {
            boolean isNormalSeat = seatItem.getStatus().equalsIgnoreCase("normal");
            SeatDetail seatDetail = SeatDetail.builder()
                    .price(request.getPrice())
                    .showingId(request.getShowingId())
                    .seat(seatItem)
                    .status( isNormalSeat ? "available" : "booked")
                    .userId(isNormalSeat ? "" : "admin")
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
               if (seatStatus.get().getUserId() == null || seatStatus.get().getUserId().isEmpty()) {
                    if (request.getStatus().equals("available")) {
                        seatStatus.get().setUserId(request.getUserId());
                        seatStatus.get().setStatus("choosing");
                        request.setStatus("choosing");
                        seatDetailDao.save(seatStatus.get());
                        sendDataToWebSocket("/topic/seat-state", request);
                    }
                } else if (seatStatus.get().getUserId().equals(request.getUserId())) {
                    if (request.getStatus().equals("choosing")) {
                        seatStatus.get().setStatus("available");
                        seatStatus.get().setUserId("");
                        request.setStatus("available");
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
            sendDataToWebSocket("/topic/seat-state", new ChoosingSeatRequest(seatStatus.getId(), "available", ""));
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
    public List<String> checkoutSeat(CheckoutSeatsRequest request) {
        List<SeatDetail> seatDetails = seatDetailDao.findAllById(request.getSeatIds());
        seatDetails.forEach(seatDetail -> {
            seatDetail.setStatus("booked");
            seatDetail.setUserId(request.getCustomerId());
        });
        seatDetails.forEach(seatDetail -> {
            ChoosingSeatRequest req = new ChoosingSeatRequest();
            req.setId(seatDetail.getId());
            req.setUserId(seatDetail.getUserId());
            req.setStatus(seatDetail.getStatus());
            sendDataToWebSocket("/topic/seat-state", req);
        });
        seatDetailDao.saveAll(seatDetails);
        return request.getSeatIds();
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

    @Override
    @Transactional
    public void deleteSeatDetails(int showingId) {
        seatDetailDao.deleteAll(seatDetailDao.findAllByShowingId(showingId));
    }

    @Override
    public List<String> refreshSeats(List<String> seatIds) {
        List<SeatDetail> seats = seatDetailDao.findAllById(seatIds);
        seats.forEach(seatDetail -> {
            seatDetail.setStatus("available");
            seatDetail.setUserId("");
        });
        seatDetailDao.saveAll(seats);
        return seatIds;
    }

    @Override
    public ResponseTemplate checkIfListSeatAvailableToCheckout(List<String> seatIds, String userId) {
        ResponseTemplate res = new ResponseTemplate();
        res.setStatus(409);
        res.setMessage("Seats is not available");
        List<SeatDetail> seats = seatDetailDao.findAllById(seatIds);
        for(SeatDetail seatDetail : seats) {
            if (seatDetail.getUserId().isEmpty() && seatDetail.getStatus().equals("available")) {
                res.setMessage("Available to checkout");
                res.setStatus(200);
                break;
            }

            if (seatDetail.getUserId().equalsIgnoreCase(userId) && seatDetail.getStatus().equals("choosing")) {
                res.setMessage("Available to checkout");
                res.setStatus(200);
                break;
            }
        }
        return res;
    }

    @Override
    public SeatDetail changeSeatPosition(ChangeSeatPositionRequest request) {
        LocalDateTime now = LocalDateTime.now();
        long daysBetween = ChronoUnit.DAYS.between(now, request.getStartTime());

        if (request.getStartTime().isAfter(now) && daysBetween >= 3) {
            SeatDetail oldSeat = seatDetailDao.findById(request.getOldPosition()).orElseThrow(() -> new SeatException(400,
                    "This seat is not exists!"));
            SeatDetail newSeat =
                    seatDetailDao.findById(request.getNewPosition()).orElseThrow(() -> new SeatException(400,
                            "This seat is not exists!"));

            if (!newSeat.getUserId().equalsIgnoreCase("") && !newSeat.getStatus().equalsIgnoreCase("available")) {
                throw new SeatException(400, "This seat is booked by someone else!");
            }

            SeatDetailInfo reqKafka = new SeatDetailInfo(oldSeat.getId(), newSeat.getId(),
                    newSeat.getSeat().getRowSeat(), newSeat.getSeat().getNumberSeat());

            newSeat.setStatus(oldSeat.getStatus());
            newSeat.setUserId(oldSeat.getUserId());
            SeatDetail newSeatSaved = seatDetailDao.save(newSeat);
            oldSeat.setUserId("");
            oldSeat.setStatus("available");
            kafkaProducerService.sendUpdatePositionSeatInfo(reqKafka);
            seatDetailDao.save(oldSeat);
            return newSeatSaved;
        } else {
            throw new SeatException(400, "This show has been released or the seat change deadline has passed.");
        }
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
