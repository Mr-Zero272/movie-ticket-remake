package com.moonmovie.movie_service.helpers;

import org.springframework.validation.BeanPropertyBindingResult;
import org.springframework.validation.BindingResult;
import org.springframework.validation.FieldError;
import org.springframework.web.bind.MethodArgumentNotValidException;

public class Helpers {
    public static MethodArgumentNotValidException createMethodArgumentNotValidException(String field, String message) {
        FieldError fieldError = new FieldError("user", field, message);
        BindingResult bindingResult = new BeanPropertyBindingResult(new Object(), "user");
        bindingResult.addError(fieldError);
        return new MethodArgumentNotValidException(null, bindingResult);
    }
}
