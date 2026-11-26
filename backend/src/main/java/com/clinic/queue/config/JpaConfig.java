package com.clinic.queue.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.data.auditing.DateTimeProvider;
import org.springframework.data.jpa.repository.config.EnableJpaAuditing;

import java.time.LocalDateTime;
import java.time.ZoneId;
import java.util.Optional;

@Configuration
@EnableJpaAuditing(dateTimeProviderRef = "bangkokDateTimeProvider")
public class JpaConfig {

    private static final ZoneId BANGKOK_ZONE = ZoneId.of("Asia/Bangkok");

    @Bean
    public DateTimeProvider bangkokDateTimeProvider() {
        return () -> Optional.of(LocalDateTime.now(BANGKOK_ZONE));
    }
}
