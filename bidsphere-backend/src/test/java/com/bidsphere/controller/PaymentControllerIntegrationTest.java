package com.bidsphere.controller;

import com.bidsphere.dto.request.PaymentRequest;
import com.bidsphere.dto.response.PaymentResponse;
import com.bidsphere.service.PaymentService;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.http.MediaType;
import org.springframework.security.test.context.support.WithMockUser;
import org.springframework.test.web.servlet.MockMvc;

import java.math.BigDecimal;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@SpringBootTest
@AutoConfigureMockMvc
class PaymentControllerIntegrationTest {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private ObjectMapper objectMapper;

    @MockBean
    private PaymentService paymentService;

    @Test
    @WithMockUser(username = "winner@example.com")
    void processPayment_Success() throws Exception {
        PaymentRequest request = PaymentRequest.builder()
                .paymentMethod("CREDIT_CARD")
                .build();

        PaymentResponse response = PaymentResponse.builder()
                .id(1L)
                .auctionId(10L)
                .amount(BigDecimal.valueOf(250))
                .status("COMPLETED")
                .transactionRef("TXN-123456789")
                .paymentMethod("CREDIT_CARD")
                .build();

        when(paymentService.processPayment(eq(10L), any(PaymentRequest.class), eq("winner@example.com")))
                .thenReturn(response);

        mockMvc.perform(post("/api/payments/auction/10")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.status").value("COMPLETED"))
                .andExpect(jsonPath("$.transactionRef").value("TXN-123456789"));
    }

    @Test
    @WithMockUser(username = "winner@example.com")
    void getPaymentByAuctionId_Success() throws Exception {
        PaymentResponse response = PaymentResponse.builder()
                .id(1L)
                .auctionId(10L)
                .amount(BigDecimal.valueOf(250))
                .status("COMPLETED")
                .build();

        when(paymentService.getPaymentByAuctionId(eq(10L), eq("winner@example.com")))
                .thenReturn(response);

        mockMvc.perform(get("/api/payments/auction/10")
                        .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.id").value(1L))
                .andExpect(jsonPath("$.amount").value(250));
    }
}
