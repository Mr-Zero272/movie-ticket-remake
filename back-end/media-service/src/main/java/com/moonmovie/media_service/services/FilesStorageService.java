package com.moonmovie.media_service.services;

import org.springframework.core.io.Resource;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

public interface FilesStorageService {
    public void init();
    public Resource loadFileAsResource(String filename, String type);
    public List<String> saveFiles(List<MultipartFile> files, String type);
    public String saveFile(MultipartFile file, String type);
    public void deleteFile(String filename, String type);
}
