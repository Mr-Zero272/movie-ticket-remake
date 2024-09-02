package com.moonmovie.movie_service.services;

import com.moonmovie.movie_service.dto.SeatDetailDto;
import com.moonmovie.movie_service.response.ResponseMessage;
import com.moonmovie.movie_service.models.SeatDetail;
import com.moonmovie.movie_service.requests.ChoosingSeatRequest;
import com.moonmovie.movie_service.requests.GenerateSeatDetailRequest;
import org.springframework.http.ResponseEntity;

import java.util.List;

public interface SeatDetailService {
    public void sendDataToWebSocket(String destination, Object data);
    public void generateSeatDetails(GenerateSeatDetailRequest request);

    List<SeatDetail> getListSeatDetail(int showingId);
    public void updateSeatStatus(ChoosingSeatRequest request);
    public ResponseEntity<ResponseMessage> refreshSeatState(List<String> listSeatIds);

    List<SeatDetail> findAllSeatByIds(List<String> seatIds);
    public ResponseEntity<List<String>> checkoutSeat(List<ChoosingSeatRequest> requests);

    List<SeatDetailDto> getListSeatDetailDto(int showingId, String userId);
}
