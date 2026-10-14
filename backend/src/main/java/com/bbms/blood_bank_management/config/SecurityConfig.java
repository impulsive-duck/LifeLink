package com.bbms.blood_bank_management.config;

import com.bbms.blood_bank_management.admin.security.AdminJwtFilter;
import com.bbms.blood_bank_management.auth.jwt.JwtFilter;
import com.bbms.blood_bank_management.donor.security.JwtAuthenticationFilter;
import com.bbms.blood_bank_management.hospitalauth.security.JwtAuthFilter;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.config.annotation.authentication.configuration.AuthenticationConfiguration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;

import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;

import java.util.List;

@Configuration
public class SecurityConfig {

    @Autowired
    private JwtFilter jwtFilter;

    @Autowired
    private JwtAuthFilter jwtAuthFilter;

    @Autowired
    private JwtAuthenticationFilter donorJwtAuthenticationFilter;

    @Autowired
    private AdminJwtFilter adminJwtFilter;

    @Bean("mainSecurityFilterChain")
    public SecurityFilterChain mainSecurityFilterChain(
            HttpSecurity http) throws Exception {

        http
                .csrf(csrf -> csrf.disable())

                .cors(cors -> cors.configurationSource(corsConfigurationSource()))

                .sessionManagement(session -> session
                        .sessionCreationPolicy(
                                SessionCreationPolicy.STATELESS))

                .headers(headers ->
                        headers.frameOptions(frame ->
                                frame.disable()))

                .authorizeHttpRequests(auth -> auth

                        .requestMatchers(
                                "/h2-console/**",

                                // Public Hospital Auth Endpoints
                                "/api/auth/login",
                                "/api/auth/signup",
                                "/api/auth/get-certificate/**",

                                // Public Admin Login
                                "/api/admin/login",

                                // Public Blood Bank Auth & Discovery Endpoints
                                "/api/bloodbanks/login",
                                "/api/bloodbanks/register",
                                "/api/bloodbanks",
                                "/api/bloodbanks/*",

                                // Public Donor Auth Endpoints
                                "/api/donor/login",
                                "/api/donor/register",

                                // API Documentation
                                "/swagger-ui/**",
                                "/swagger-ui.html",
                                "/v3/api-docs",
                                "/v3/api-docs/**"

                        ).permitAll()

                        .anyRequest()
                        .authenticated());

        // Admin JWT Filter
        http.addFilterBefore(
                adminJwtFilter,
                UsernamePasswordAuthenticationFilter.class);

        // Blood Bank JWT Filter
        http.addFilterBefore(
                jwtFilter,
                UsernamePasswordAuthenticationFilter.class);

        // Hospital JWT Filter
        http.addFilterBefore(
                jwtAuthFilter,
                UsernamePasswordAuthenticationFilter.class);

        // Donor JWT Filter
        http.addFilterBefore(
                donorJwtAuthenticationFilter,
                UsernamePasswordAuthenticationFilter.class);

        return http.build();
    }

    @Bean
    public AuthenticationManager authenticationManager(
            AuthenticationConfiguration configuration)
            throws Exception {

        return configuration.getAuthenticationManager();
    }

    @Bean
    public CorsConfigurationSource corsConfigurationSource() {

        CorsConfiguration configuration = new CorsConfiguration();

        configuration.setAllowedOriginPatterns(
                List.of("*"));

        configuration.setAllowedMethods(
                List.of(
                        "GET",
                        "POST",
                        "PUT",
                        "PATCH",
                        "DELETE",
                        "OPTIONS"));

        configuration.setAllowedHeaders(
                List.of("*"));

        configuration.setAllowCredentials(true);

        UrlBasedCorsConfigurationSource source =
                new UrlBasedCorsConfigurationSource();

        source.registerCorsConfiguration(
                "/**",
                configuration);

        return source;
    }
}