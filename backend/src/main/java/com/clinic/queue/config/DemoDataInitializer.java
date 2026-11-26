package com.clinic.queue.config;

import com.clinic.queue.entity.User;
import com.clinic.queue.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

/**
 * Ensures the demo staff account always has a password encoded by this app's
 * PasswordEncoder bean (avoids brittle hardcoded BCrypt hashes in SQL seeds).
 */
@Component
@RequiredArgsConstructor
@Slf4j
public class DemoDataInitializer implements CommandLineRunner {

    public static final String DEMO_USERNAME = "demo";
    public static final String DEMO_PASSWORD = "demo123";

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    @Override
    public void run(String... args) {
        userRepository.findByUsername(DEMO_USERNAME).ifPresentOrElse(user -> {
            if (!passwordEncoder.matches(DEMO_PASSWORD, user.getPassword())) {
                user.setPassword(passwordEncoder.encode(DEMO_PASSWORD));
                user.setActive(true);
                userRepository.save(user);
                log.info("Updated demo user password with PasswordEncoder");
            }
        }, () -> {
            User user = new User();
            user.setUsername(DEMO_USERNAME);
            user.setPassword(passwordEncoder.encode(DEMO_PASSWORD));
            user.setFullName("สมชาย ใจดี");
            user.setRole("STAFF");
            user.setActive(true);
            userRepository.save(user);
            log.info("Created demo user '{}' with PasswordEncoder", DEMO_USERNAME);
        });
    }
}
