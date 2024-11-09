package com.moonmovie.movie_service.services;
import org.thymeleaf.context.Context;

public interface MailService {
    void sendEmailWithHtmlTemplate(String to, String subject, String templateName, Context context);
}
