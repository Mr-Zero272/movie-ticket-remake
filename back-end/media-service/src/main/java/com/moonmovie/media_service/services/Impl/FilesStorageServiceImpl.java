package com.moonmovie.media_service.services.Impl;

import com.moonmovie.media_service.constants.MediaErrorConstants;
import com.moonmovie.media_service.exceptions.MediaException;
import com.moonmovie.media_service.services.FilesStorageService;
import org.springframework.core.io.Resource;
import org.springframework.core.io.UrlResource;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.net.MalformedURLException;
import java.nio.file.FileAlreadyExistsException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.*;

@Service
public class FilesStorageServiceImpl implements FilesStorageService {

    private final Path rootImage = Paths.get("uploads/images");
    private final Path rootVideo = Paths.get("uploads/videos");

    public void init() {
        try {
            Files.createDirectories(rootImage);
            Files.createDirectories(rootVideo);
        } catch (IOException e) {
            throw new RuntimeException("Could not initialize folder for upload!");
        }
    }


    @Override
    public Resource loadFileAsResource(String filename, String type) {
        try {
            Path file = getPath(type).resolve(filename);
            Resource resource = new UrlResource(file.toUri());

            if (resource.exists() || resource.isReadable()) {
                return resource;
            } else {
                if (type.equals("image")) {
                    throw new MediaException(MediaErrorConstants.ERROR_UNABLE_TO_LOAD_IMAGE);
                } else {
                    throw new MediaException(MediaErrorConstants.ERROR_UNABLE_TO_LOAD_VIDEO);
                }
            }
        } catch (MalformedURLException e) {
            throw new RuntimeException("Error: " + e.getMessage());
        }
    }

    @Override
    public List<String> saveFiles(List<MultipartFile> files, String type) {
        Path finalPath = getPath(type);
        List<String> pathsFileAfterSaved = new ArrayList<>();
        files.forEach(file -> {
            try {
                String fileName = UUID.randomUUID() + file.getOriginalFilename();
                Files.copy(file.getInputStream(), finalPath.resolve(fileName));
                if (type.equals("image")) {
                    pathsFileAfterSaved.add("http://localhost:8272/api/v2/moon-movie/media/images/" + fileName);
                } else {
                    pathsFileAfterSaved.add("http://localhost:8272/api/v2/moon-movie/media/videos/" + fileName);
                }
            } catch (IOException e) {
                if (e instanceof FileAlreadyExistsException) {
                    throw new MediaException(400, "This file (" + file.getOriginalFilename() + ") already exists.");
                }

                throw new MediaException(500, e.getMessage());
            }
        });
        return pathsFileAfterSaved;
    }

    @Override
    public String saveFile(MultipartFile file, String type) {
        Path finalPath = getPath(type);
        String pathFileAfterSaved = "";
        try {
            String fileName = UUID.randomUUID() + file.getOriginalFilename();
            Files.copy(file.getInputStream(), finalPath.resolve(fileName));
            if (type.equals("image")) {
                pathFileAfterSaved = "http://localhost:8272/api/v2/moon-movie/media/images/" + fileName;
            } else {
                pathFileAfterSaved = "http://localhost:8272/api/v2/moon-movie/media/videos/" + fileName;
            }
        } catch (IOException e) {
            if (e instanceof FileAlreadyExistsException) {
                throw new MediaException(400, "This file (" + file.getOriginalFilename() + ") already exists.");
            }

            throw new MediaException(500, e.getMessage());
        }

        return pathFileAfterSaved;
    }

    @Override
    public void deleteFile(String filename, String type) {
        Path finalPath = getPath(type);

        try {
            Path fileDelete = finalPath.resolve(Objects.requireNonNull(filename));
            Files.deleteIfExists(fileDelete);
        } catch (IOException e) {
            if (e instanceof FileAlreadyExistsException) {
                throw new MediaException(500, "Cannot delete this file: (" + filename + ")");
            }
            throw new MediaException(500, e.getMessage());
        }
    }

    private Path getPath(String type) {
        if (type.equals("image")) {
            return rootImage;
        }
        return rootVideo;
    }
}
