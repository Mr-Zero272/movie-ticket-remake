package com.moonmovie.media_service;

import com.moonmovie.media_service.services.FilesStorageService;
import jakarta.annotation.Resource;
import org.springframework.boot.CommandLineRunner;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

@SpringBootApplication
public class MediaServiceApplication implements CommandLineRunner {
	@Resource
	private FilesStorageService filesStorageService;

	public static void main(String[] args) {
		SpringApplication.run(MediaServiceApplication.class, args);
	}

	@Override
	public void run(String... args) throws Exception {
		filesStorageService.init();
	}
}
