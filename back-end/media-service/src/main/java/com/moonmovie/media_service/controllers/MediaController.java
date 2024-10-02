package com.moonmovie.media_service.controllers;

import com.moonmovie.media_service.services.FilesStorageService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.io.Resource;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

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

    @GetMapping("/videos/{videoName}")
    public ResponseEntity<Resource> getVideo(@PathVariable String videoName) {
        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_OCTET_STREAM);
        return new ResponseEntity<>(filesStorageService.loadFileAsResource(videoName, "video"), headers, HttpStatus.OK);
    }

    @PostMapping(value = "/images", consumes = MULTIPART_FORM_DATA, produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<List<String>> saveImage(@RequestParam("files") List<MultipartFile> files) {
        return ResponseEntity.ok(filesStorageService.saveFiles(files, "image"));
    }

    @PostMapping(value ="/videos", consumes = MULTIPART_FORM_DATA, produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<List<String>> saveVideo(@RequestParam("files") List<MultipartFile> files) {
        return ResponseEntity.ok(filesStorageService.saveFiles(files, "video"));
    }
}
