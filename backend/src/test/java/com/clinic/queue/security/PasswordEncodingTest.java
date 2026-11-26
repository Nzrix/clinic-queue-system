package com.clinic.queue.security;

import com.clinic.queue.config.DemoDataInitializer;
import com.clinic.queue.entity.User;
import com.clinic.queue.repository.UserRepository;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.test.context.ActiveProfiles;

import static org.assertj.core.api.Assertions.assertThat;

/**
 * Isolates hash vs security-config: loads the demo user (seeded by
 * DemoDataInitializer via PasswordEncoder) and asserts matches().
 */
@SpringBootTest
@ActiveProfiles("test")
public class PasswordEncodingTest {

    @Autowired
    private UserDetailsService userDetailsService;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Autowired
    private UserRepository userRepository;

    @Test
    public void testPasswordEncodingAndMatching() {
        String rawPassword = DemoDataInitializer.DEMO_PASSWORD;

        assertThat(passwordEncoder.matches(rawPassword, passwordEncoder.encode(rawPassword))).isTrue();

        UserDetails userDetails = userDetailsService.loadUserByUsername(DemoDataInitializer.DEMO_USERNAME);
        assertThat(userDetails.getUsername()).isEqualTo(DemoDataInitializer.DEMO_USERNAME);
        assertThat(userDetails.isEnabled()).isTrue();
        assertThat(userDetails.isAccountNonLocked()).isTrue();
        assertThat(userDetails.isAccountNonExpired()).isTrue();
        assertThat(userDetails.isCredentialsNonExpired()).isTrue();

        User dbUser = userRepository.findByUsername(DemoDataInitializer.DEMO_USERNAME).orElseThrow();
        assertThat(dbUser.getPassword().length()).isGreaterThanOrEqualTo(60);
        assertThat(passwordEncoder.matches(rawPassword, userDetails.getPassword())).isTrue();
        assertThat(passwordEncoder.matches(rawPassword, dbUser.getPassword())).isTrue();
    }
}
