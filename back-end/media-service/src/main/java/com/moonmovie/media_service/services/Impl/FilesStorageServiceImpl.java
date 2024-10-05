package com.moonmovie.media_service.services.Impl;

import com.moonmovie.media_service.constants.MediaErrorConstants;
import com.moonmovie.media_service.exceptions.MediaException;
import com.moonmovie.media_service.response.TemplateResponse;
import com.moonmovie.media_service.services.FilesStorageService;
import lombok.extern.slf4j.Slf4j;
import org.apache.commons.lang.RandomStringUtils;
import org.springframework.core.io.InputStreamResource;
import org.springframework.core.io.Resource;
import org.springframework.core.io.UrlResource;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.File;
import java.io.FileInputStream;
import java.io.IOException;
import java.net.MalformedURLException;
import java.nio.file.FileAlreadyExistsException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.ArrayList;
import java.util.List;
import java.util.Objects;

@Service
@Slf4j
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
    public InputStreamResource loadVideo(String filename) {
        try {
            Path pathFile = getPath("video").resolve(filename);
            FileInputStream fileInputStream = new FileInputStream(pathFile.toFile());
            return new InputStreamResource(fileInputStream);
        } catch (Exception e) {
            throw new RuntimeException("Error: " + e.getMessage());
        }
    }

    @Override
    public List<String> saveFiles(List<MultipartFile> files, String type) {
        Path finalPath = getPath(type);
        List<String> pathsFileAfterSaved = new ArrayList<>();
        files.forEach(file -> {
            try {
                String fileName = RandomStringUtils.random(28, true, true) + file.getOriginalFilename().substring(file.getOriginalFilename().lastIndexOf("."));
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
            String fileName = RandomStringUtils.random(28, true, true) + file.getOriginalFilename().substring(file.getOriginalFilename().lastIndexOf("."));
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
    public TemplateResponse deleteFile(List<String> filenames, String type) {
        List<String> fileCannotDelete = new ArrayList<>();
        boolean canDelete = false;
        Path finalPath = getPath(type);

        for(String filename: filenames) {
            try {
                Path fileDelete = finalPath.resolve(Objects.requireNonNull(filename));
                canDelete = Files.deleteIfExists(fileDelete);
                if (!canDelete) {
                    fileCannotDelete.add(filename);
                }
            } catch (IOException e) {
                if (e instanceof FileAlreadyExistsException) {
                    log.info("Cannot delete this file: (" + filename + ")");
                    fileCannotDelete.add(filename);
                } else {
                    log.info("IOException" + e.getMessage());
                }
            }
        }

        if (!fileCannotDelete.isEmpty() && !canDelete) {
            return new TemplateResponse(200, "Some file not exist in the system: " + fileCannotDelete);
        } else {
            return new TemplateResponse(200, "Delete files successfully!");
        }
    }

    private Path getPath(String type) {
        if (type.equals("image")) {
            return rootImage;
        }
        return rootVideo;
    }
}
