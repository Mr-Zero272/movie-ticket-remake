package com.moonmovie.auth_service.feign;

import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.RequestBody;

import java.util.List;
import java.util.Map;

@FeignClient("MEDIA-SERVICE")
public interface MediaServiceInterface {
    @DeleteMapping("/api/v2/moon-movie/media/images")
    public ResponseEntity<?> deleteImages(@RequestBody Map<String, List<String>> request);
}
