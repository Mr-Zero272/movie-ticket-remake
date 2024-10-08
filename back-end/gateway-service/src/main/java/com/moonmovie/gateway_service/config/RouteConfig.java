package com.moonmovie.gateway_service.config;

import com.moonmovie.gateway_service.filters.AuthenticationFilter;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.cloud.gateway.route.RouteLocator;
import org.springframework.cloud.gateway.route.builder.RouteLocatorBuilder;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;

@Configuration
public class RouteConfig {
    @Autowired
    private AuthenticationFilter authenticationFilter;

    @Bean
    public RouteLocator myRoutes(RouteLocatorBuilder builder) {
        return builder.routes()
                .route("media-service", predicateSpec ->
                        predicateSpec.path("/api/v2/moon-movie/media/**")
                                .filters(f -> f
                                        .rewritePath("/api/v2/moon-movie/media/images//(?<segment>.*)", "/images/${segment}")
                                        .rewritePath("/api/v2/moon-movie/media/videos//(?<segment>.*)", "/videos/${segment}"))
                                .uri("lb://media-service"))
                .route("movie-service-schedule", predicateSpec ->
                        predicateSpec.path("/api/v2/moon-movie/movie/schedule")
                                .filters(f -> f.filter(authenticationFilter))
                                .uri("lb://movie-service"))
                .route("movie-service-favorite", predicateSpec ->
                        predicateSpec.path("/api/v2/moon-movie/movie/favorite/**")
                                .filters(f -> f.filter(authenticationFilter))
                                .uri("lb://movie-service"))
                .route("movie-service", predicateSpec ->
                        predicateSpec.path("/api/v2/moon-movie/movie/**")
                                .uri("lb://movie-service"))
                .route("recommend-service", predicateSpec ->
                        predicateSpec.path("/api/v2/moon-movie/recommend/**")
                                .filters(f -> f.filter(authenticationFilter))
                                .uri("lb://recommend-service"))
                .route("seat-service", predicateSpec ->
                        predicateSpec.path("/api/v2/moon-movie/seat/**")
                                .filters(f -> f.filter(authenticationFilter))
                                .uri("lb://seat-service"))
                .route("seat-service", predicateSpec ->
                        predicateSpec.path("/ws/**")
                                .uri("lb://seat-service"))
                .route("reservation-service", predicateSpec ->
                        predicateSpec.path("/api/v2/moon-movie/reservation/**")
                                .filters(f -> f.filter(authenticationFilter))
                                .uri("lb://reservation-service"))
                .route("auth-service-protect", predicateSpec ->
                        predicateSpec.path("/api/v2/moon-movie/auth/user/**")
                                .filters(f -> f.filter(authenticationFilter))
                                .uri("lb://auth-service"))
                .route("auth-service-protect", predicateSpec ->
                        predicateSpec.path("/api/v2/moon-movie/auth/users/**")
                                .filters(f -> f.filter(authenticationFilter))
                                .uri("lb://auth-service"))
                .route("auth-service", predicateSpec ->
                        predicateSpec.path("/api/v2/moon-movie/auth/**")
                                .uri("lb://auth-service"))
                .build();
    }
}
