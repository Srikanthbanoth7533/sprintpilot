package com.sprintpilot.api.controller;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.sprintpilot.api.dto.LoginRequest;
import com.sprintpilot.api.dto.RegisterRequest;
import com.sprintpilot.api.entity.Role;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@SpringBootTest
@AutoConfigureMockMvc
class AuthControllerIntegrationTest {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private ObjectMapper objectMapper;

    @Test
    @DisplayName("GET /api/health should be publicly accessible and return UP status")
    void testHealthEndpoint() throws Exception {
        mockMvc.perform(get("/api/health"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.status").value("UP"))
                .andExpect(jsonPath("$.service").value("sprintpilot-api"));
    }

    @Test
    @DisplayName("POST /api/auth/login should authenticate seeded admin user and return signed JWT")
    void testLoginSuccess() throws Exception {
        LoginRequest request = new LoginRequest("admin@sprintpilot.demo", "DemoPassword123!");

        mockMvc.perform(post("/api/auth/login")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.token").isNotEmpty())
                .andExpect(jsonPath("$.email").value("admin@sprintpilot.demo"))
                .andExpect(jsonPath("$.role").value("ROLE_ADMIN"));
    }

    @Test
    @DisplayName("POST /api/auth/login with wrong password should return 401 Unauthorized")
    void testLoginFailure() throws Exception {
        LoginRequest request = new LoginRequest("admin@sprintpilot.demo", "WrongPassword!");

        mockMvc.perform(post("/api/auth/login")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isUnauthorized());
    }

    @Test
    @DisplayName("POST /api/auth/register should register a new developer user")
    void testRegisterUser() throws Exception {
        RegisterRequest request = new RegisterRequest();
        request.setName("John Developer");
        request.setEmail("john.dev." + System.currentTimeMillis() + "@sprintpilot.demo");
        request.setPassword("SecurePass123!");
        request.setRole(Role.ROLE_DEVELOPER);
        request.setTitle("Backend Engineer");
        request.setDepartment("Platform");

        mockMvc.perform(post("/api/auth/register")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.name").value("John Developer"))
                .andExpect(jsonPath("$.role").value("ROLE_DEVELOPER"));
    }

    @Test
    @DisplayName("GET /api/products without JWT should return 401 Unauthorized")
    void testProtectedProductsEndpointWithoutToken() throws Exception {
        mockMvc.perform(get("/api/products"))
                .andExpect(status().isUnauthorized());
    }
}
