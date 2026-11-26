package com.clinic.queue.security;

import com.clinic.queue.entity.User;
import com.clinic.queue.repository.UserRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;

import static org.assertj.core.api.Assertions.assertThat;

@SpringBootTest
@ActiveProfiles("test")
@Transactional
public class PasswordEncodingTest {
    
    @Autowired
    private UserDetailsService userDetailsService;
    
    @Autowired
    private PasswordEncoder passwordEncoder;
    
    @Autowired
    private UserRepository userRepository;
    
    @BeforeEach
    public void setup() {
        // Create demo user with encoded password
        userRepository.deleteAll();
        
        String rawPassword = "demo123";
        String encodedPassword = passwordEncoder.encode(rawPassword);
        
        User user = new User();
        user.setUsername("demo");
        user.setPassword(encodedPassword);
        user.setFullName("สมชาย ใจดี");
        user.setRole("STAFF");
        user.setActive(true);
        user.setCreatedAt(LocalDateTime.now());
        user.setUpdatedAt(LocalDateTime.now());
        
        userRepository.save(user);
        userRepository.flush();
        
        System.out.println("Created test user with password hash: " + encodedPassword);
    }
    
    @Test
    public void testPasswordEncodingAndMatching() {
        String rawPassword = "demo123";
        
        // Test 1: BCrypt encoder works
        String encoded = passwordEncoder.encode(rawPassword);
        System.out.println("Generated hash: " + encoded);
        assertThat(passwordEncoder.matches(rawPassword, encoded)).isTrue();
        
        // Test 2: Can load user
        UserDetails userDetails = userDetailsService.loadUserByUsername("demo");
        assertThat(userDetails).isNotNull();
        assertThat(userDetails.getUsername()).isEqualTo("demo");
        
        // Test 3: Check flags
        System.out.println("isEnabled: " + userDetails.isEnabled());
        System.out.println("isAccountNonLocked: " + userDetails.isAccountNonLocked());
        System.out.println("isAccountNonExpired: " + userDetails.isAccountNonExpired());
        System.out.println("isCredentialsNonExpired: " + userDetails.isCredentialsNonExpired());
        
        assertThat(userDetails.isEnabled()).isTrue();
        assertThat(userDetails.isAccountNonLocked()).isTrue();
        assertThat(userDetails.isAccountNonExpired()).isTrue();
        assertThat(userDetails.isCredentialsNonExpired()).isTrue();
        
        // Test 4: Check password from DB
        User dbUser = userRepository.findByUsername("demo").orElseThrow();
        System.out.println("DB password hash: " + dbUser.getPassword());
        System.out.println("DB password length: " + dbUser.getPassword().length());
        
        // Test 5: Does the DB password match?
        boolean matches = passwordEncoder.matches(rawPassword, userDetails.getPassword());
        System.out.println("Password matches with UserDetails: " + matches);
        
        // Test 6: Does the DB password match directly?
        boolean dbMatches = passwordEncoder.matches(rawPassword, dbUser.getPassword());
        System.out.println("Password matches with DB user: " + dbMatches);
        
        assertThat(matches).isTrue();
        assertThat(dbMatches).isTrue();
    }
}
