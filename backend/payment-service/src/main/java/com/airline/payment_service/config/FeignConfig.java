package com.airline.payment_service.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.context.request.RequestContextHolder;

import feign.RequestInterceptor;

@Configuration
public class FeignConfig {

    @Bean
    public RequestInterceptor requestInterceptor() {
        return requestTemplate -> {

            // Get JWT from current request
            String token = RequestContextHolder.getRequestAttributes()
                    .getAttribute("Authorization", 0).toString();

            requestTemplate.header("Authorization", token);
        };
    }
}