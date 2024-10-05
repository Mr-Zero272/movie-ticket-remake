package com.moonmovie.media_service.services;

import com.moonmovie.media_service.response.TemplateResponse;
import org.springframework.core.io.InputStreamResource;
import org.springframework.core.io.Resource;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

public interface FilesStorageService {
    void init();

    Resource loadFileAsResource(String filename, String type);

    InputStreamResource loadVideo(String filename);

    List<String> saveFiles(List<MultipartFile> files, String type);

    String saveFile(MultipartFile file, String type);

    TemplateResponse deleteFile(List<String> filenames, String type);
}
