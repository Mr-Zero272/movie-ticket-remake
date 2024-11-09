package com.moonmovie.movie_service.services;

import com.moonmovie.movie_service.dto.SeatDetailDto;
import com.moonmovie.movie_service.requests.CheckoutSeatsRequest;
import com.moonmovie.movie_service.response.ResponseMessage;
import com.moonmovie.movie_service.models.SeatDetail;
import com.moonmovie.movie_service.requests.ChoosingSeatRequest;
import com.moonmovie.movie_service.requests.GenerateSeatDetailRequest;
import com.moonmovie.movie_service.response.ResponseTemplate;
import org.springframework.http.ResponseEntity;

import java.util.List;

public interface SeatDetailService {
    public void sendDataToWebSocket(String destination, Object data);
    public void generateSeatDetails(GenerateSeatDetailRequest request);

    List<SeatDetail> getListSeatDetail(int showingId);
    public void updateSeatStatus(ChoosingSeatRequest request);
    public ResponseTemplate refreshSeatState(int showingId, String userId);

    List<SeatDetail> findAllSeatByIds(List<String> seatIds);
    public List<String> checkoutSeat(CheckoutSeatsRequest request);

    List<SeatDetailDto> getListSeatDetailDto(int showingId, String userId);

    void deleteSeatDetails(int showingId);

    public List<String> refreshSeats(List<String> seatIds);

    ResponseTemplate checkIfListSeatAvailableToCheckout(List<String> seatIds, String userId);
}
