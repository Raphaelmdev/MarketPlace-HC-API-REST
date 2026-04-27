package br.com.hazze.cury.marketplace.config;

import br.com.hazze.cury.marketplace.Security.JwtAuthenticationFilter;
import br.com.hazze.cury.marketplace.handler.CustomAccessDeniedHandler;
import br.com.hazze.cury.marketplace.handler.CustomAuthenticationEntryPoint;
import lombok.RequiredArgsConstructor;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.config.annotation.authentication.configuration.AuthenticationConfiguration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;


@RequiredArgsConstructor
@Configuration
@EnableWebSecurity
public class SecurityConfiguration {

    private final CustomAccessDeniedHandler customAccessDeniedHandler;

    private final CustomAuthenticationEntryPoint customAuthenticationEntryPoint;

    private final JwtAuthenticationFilter jwtAuthenticationFilter;


    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity httpSecurity) throws Exception {

        return httpSecurity
                .cors(cors -> {})
                .csrf(csrf -> csrf.disable())
                .sessionManagement(session -> session.sessionCreationPolicy(SessionCreationPolicy.STATELESS))
                .exceptionHandling(ex -> ex
                        .accessDeniedHandler(customAccessDeniedHandler)
                        .authenticationEntryPoint(customAuthenticationEntryPoint)
                )
                .authorizeHttpRequests(authorize -> authorize

                        // PUBLIC ROUTES

                        .requestMatchers("/swagger-ui/**", "/swagger-ui.html", "/v3/api-docs/**").permitAll()

                        .requestMatchers(HttpMethod.GET, "/auth/check-email").permitAll()
                        .requestMatchers(HttpMethod.POST, "/auth/register").permitAll()
                        .requestMatchers(HttpMethod.POST, "/auth/login").permitAll()
                        .requestMatchers(HttpMethod.POST, "/auth/forgot-password").permitAll()
                        .requestMatchers(HttpMethod.POST, "/auth/reset-password").permitAll()

                        .requestMatchers(HttpMethod.GET, "/products/**").permitAll()
                        .requestMatchers(HttpMethod.GET, "/categories/**").permitAll()

                        //  CLIENT ROUTES

                        // USER (próprio usuário)
                        .requestMatchers(HttpMethod.GET, "/users/me").hasRole("CLIENT")
                        .requestMatchers(HttpMethod.PUT, "/users/me").hasRole("CLIENT")

                        // WISHLIST
                        .requestMatchers(HttpMethod.GET, "/wishlist/me").hasRole("CLIENT")
                        .requestMatchers(HttpMethod.POST, "/wishlist/items/*").hasRole("CLIENT")
                        .requestMatchers(HttpMethod.DELETE, "/wishlist/items/*").hasRole("CLIENT")

                        // CART
                        .requestMatchers(HttpMethod.POST, "/carts").hasRole("CLIENT")
                        .requestMatchers(HttpMethod.GET, "/carts/me").hasRole("CLIENT")
                        .requestMatchers(HttpMethod.GET, "/carts/me/items").hasRole("CLIENT")
                        .requestMatchers(HttpMethod.POST, "/carts/me/items").hasRole("CLIENT")
                        .requestMatchers(HttpMethod.PUT, "/carts/items/*").hasRole("CLIENT")
                        .requestMatchers(HttpMethod.DELETE, "/carts/items/*").hasRole("CLIENT")
                        .requestMatchers(HttpMethod.DELETE, "/carts/me/items").hasRole("CLIENT")

                        // ORDER
                        .requestMatchers(HttpMethod.POST, "/orders/from-cart").hasRole("CLIENT")
                        .requestMatchers(HttpMethod.GET, "/orders/me").hasRole("CLIENT")
                        .requestMatchers(HttpMethod.GET, "/orders/me/**").hasRole("CLIENT")
                        .requestMatchers(HttpMethod.PATCH, "/orders/me/*/cancel").hasRole("CLIENT")

                        // ADMIN ROUTES

                        // PRODUCTS
                        .requestMatchers(HttpMethod.POST, "/products/*/image").hasRole("ADMIN")
                        .requestMatchers(HttpMethod.POST, "/products").hasRole("ADMIN")
                        .requestMatchers(HttpMethod.PUT, "/products/**").hasRole("ADMIN")
                        .requestMatchers(HttpMethod.PATCH, "/products/**").hasRole("ADMIN")
                        .requestMatchers(HttpMethod.DELETE, "/products/**").hasRole("ADMIN")

                        // CATEGORIES
                        .requestMatchers(HttpMethod.POST, "/categories").hasRole("ADMIN")
                        .requestMatchers(HttpMethod.PUT, "/categories/**").hasRole("ADMIN")
                        .requestMatchers(HttpMethod.DELETE, "/categories/**").hasRole("ADMIN")


                        // USERS (admin gerencia tudo)
                        .requestMatchers(HttpMethod.GET, "/users").hasRole("ADMIN")
                        .requestMatchers(HttpMethod.GET, "/users/{id}").hasRole("ADMIN")
                        .requestMatchers(HttpMethod.POST, "/users/admin").hasRole("ADMIN")
                        .requestMatchers(HttpMethod.PATCH, "/users/*/status").hasRole("ADMIN")
                        .requestMatchers(HttpMethod.DELETE, "/users/*").hasRole("ADMIN")

                        // ORDERS
                        .requestMatchers(HttpMethod.GET, "/orders").hasRole("ADMIN")
                        .requestMatchers(HttpMethod.PATCH, "/orders/*/status").hasRole("ADMIN")
                        .requestMatchers(HttpMethod.DELETE, "/orders/*").hasRole("ADMIN")

                        // FALLBACK
                        .anyRequest().authenticated()

                )
                .addFilterBefore(jwtAuthenticationFilter, UsernamePasswordAuthenticationFilter.class)
                .build();
    }
    @Bean
    public AuthenticationManager authenticationManager(AuthenticationConfiguration authenticationConfiguration) throws Exception{
        return authenticationConfiguration.getAuthenticationManager();
    }
    @Bean
    public PasswordEncoder passwordEncoder(){
        return new BCryptPasswordEncoder();
    }
}