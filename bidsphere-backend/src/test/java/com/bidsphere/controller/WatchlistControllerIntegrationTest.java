package com.bidsphere.controller;

import com.bidsphere.dto.response.WatchlistResponse;
import com.bidsphere.service.WatchlistService;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.Pageable;
import org.springframework.http.MediaType;
import org.springframework.security.test.context.support.WithMockUser;
import org.springframework.test.web.servlet.MockMvc;

import java.util.List;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@SpringBootTest
@AutoConfigureMockMvc
class WatchlistControllerIntegrationTest {

    @Autowired
    private MockMvc mockMvc;

    @MockBean
    private WatchlistService watchlistService;

    @Test
    @WithMockUser(username = "bidder@example.com")
    void addToWatchlist_Success() throws Exception {
        WatchlistResponse response = WatchlistResponse.builder()
                .id(1L)
                .auctionId(5L)
                .build();

        when(watchlistService.addToWatchlist(eq(5L), eq("bidder@example.com"))).thenReturn(response);

        mockMvc.perform(post("/api/watchlist/5")
                        .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.id").value(1L))
                .andExpect(jsonPath("$.auctionId").value(5L));
    }

    @Test
    @WithMockUser(username = "bidder@example.com")
    void removeFromWatchlist_Success() throws Exception {
        mockMvc.perform(delete("/api/watchlist/5")
                        .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isNoContent());

        verify(watchlistService).removeFromWatchlist(5L, "bidder@example.com");
    }

    @Test
    @WithMockUser(username = "bidder@example.com")
    void getUserWatchlist_Success() throws Exception {
        WatchlistResponse response = WatchlistResponse.builder().id(1L).auctionId(5L).build();
        when(watchlistService.getUserWatchlist(eq("bidder@example.com"), any(Pageable.class)))
                .thenReturn(new PageImpl<>(List.of(response)));

        mockMvc.perform(get("/api/watchlist")
                        .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.content[0].id").value(1L));
    }

    @Test
    @WithMockUser(username = "bidder@example.com")
    void checkStatus_Success() throws Exception {
        when(watchlistService.isAuctionInWatchlist(5L, "bidder@example.com")).thenReturn(true);

        mockMvc.perform(get("/api/watchlist/5/status")
                        .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.inWatchlist").value(true));
    }
}
