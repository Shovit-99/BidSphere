package com.bidsphere.controller;

import com.bidsphere.dto.request.ChangePasswordRequest;
import com.bidsphere.dto.response.UserProfileResponse;
import com.bidsphere.service.UserService;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.http.MediaType;
import org.springframework.security.test.context.support.WithMockUser;
import org.springframework.test.web.servlet.MockMvc;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.put;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@SpringBootTest
@AutoConfigureMockMvc
class UserControllerIntegrationTest {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private ObjectMapper objectMapper;

    @MockBean
    private UserService userService;

    @Test
    @WithMockUser(username = "user@example.com")
    void getCurrentProfile_Success() throws Exception {
        UserProfileResponse response = UserProfileResponse.builder()
                .id(1L)
                .name("Current User")
                .email("user@example.com")
                .totalBids(12)
                .totalWonAuctions(3)
                .build();

        when(userService.getCurrentUserProfile("user@example.com")).thenReturn(response);

        mockMvc.perform(get("/api/users/profile")
                        .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.email").value("user@example.com"))
                .andExpect(jsonPath("$.totalBids").value(12))
                .andExpect(jsonPath("$.totalWonAuctions").value(3));
    }

    @Test
    @WithMockUser(username = "user@example.com")
    void changePassword_Success() throws Exception {
        ChangePasswordRequest request = ChangePasswordRequest.builder()
                .currentPassword("oldPassword123")
                .newPassword("newPassword123")
                .build();

        mockMvc.perform(put("/api/users/change-password")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.message").value("Password changed successfully"));

        verify(userService).changePassword(eq("user@example.com"), any(ChangePasswordRequest.class));
    }

    @Test
    void getPublicProfileById_Success() throws Exception {
        UserProfileResponse response = UserProfileResponse.builder()
                .id(5L)
                .name("Public Seller")
                .build();

        when(userService.getUserProfileById(5L)).thenReturn(response);

        mockMvc.perform(get("/api/users/5")
                        .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.id").value(5L))
                .andExpect(jsonPath("$.name").value("Public Seller"));
    }
}
