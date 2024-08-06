package com.moonmovie.gateway_service.config;

import com.moonmovie.gateway_service.filters.AuthenticationFilter;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.cloud.gateway.route.RouteLocator;
import org.springframework.cloud.gateway.route.builder.RouteLocatorBuilder;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

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
                .route("user-service", predicateSpec ->
                        predicateSpec.path("/api/v2/moon-movie/user/**")
                                .filters(f -> f.rewritePath("/api/v2/moon-movie/user//(?<segment>.*)", "/user/${segment}")
                                        .filter(authenticationFilter))
                                .uri("lb://user-service"))
                .build();
    }
}
