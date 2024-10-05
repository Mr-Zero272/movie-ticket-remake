package com.moonmovie.media_service.controllers;

import com.moonmovie.media_service.response.TemplateResponse;
import com.moonmovie.media_service.services.FilesStorageService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.io.Resource;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.List;
import java.util.Map;

import static org.apache.tomcat.util.http.fileupload.FileUploadBase.MULTIPART_FORM_DATA;

@RestController
@RequestMapping("/api/v2/moon-movie/media")
public class MediaController {
    @Autowired
    private FilesStorageService filesStorageService;

    @GetMapping("/images/{imageName}")
    public ResponseEntity<Resource> getImage(@PathVariable String imageName) {
        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.IMAGE_JPEG);
        return new ResponseEntity<>(filesStorageService.loadFileAsResource(imageName, "image"), headers, HttpStatus.OK);
    }

    @GetMapping(value = "/videos/{videoName}", produces = "video/mp4")
    public ResponseEntity<Resource> getVideo(@PathVariable String videoName) throws IOException {
        Resource resource = filesStorageService.loadFileAsResource(videoName, "video");
        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.valueOf("video/mp4"));
        headers.setContentLength(resource.contentLength());
        headers.setContentDispositionFormData("inline", videoName);
        return new ResponseEntity<>(resource, headers, HttpStatus.OK);
    }

    @PostMapping(value = "/images", consumes = MULTIPART_FORM_DATA, produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<List<String>> saveImage(@RequestParam("files") List<MultipartFile> files) {
        return ResponseEntity.ok(filesStorageService.saveFiles(files, "image"));
    }

    @PostMapping(value ="/videos", consumes = MULTIPART_FORM_DATA, produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<List<String>> saveVideo(@RequestParam("files") List<MultipartFile> files) {
        return ResponseEntity.ok(filesStorageService.saveFiles(files, "video"));
    }

    @DeleteMapping("/videos")
    public ResponseEntity<TemplateResponse> deleteVideos(@RequestBody Map<String, List<String>> request) {
        return ResponseEntity.ok(filesStorageService.deleteFile(request.get("filenames"), "video"));
    }

    @DeleteMapping("/images")
    public ResponseEntity<TemplateResponse> deleteImages(@RequestBody Map<String, List<String>> request) {
        return ResponseEntity.ok(filesStorageService.deleteFile(request.get("filenames"), "image"));
    }
}
