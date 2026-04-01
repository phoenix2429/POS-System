package com.pos.backend.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class OrderResponse {
    private Long id;
    private String customerName;
    private String phone;
    private BigDecimal totalAmount;
    private BigDecimal tax;
    private String paymentType;
    private String status;
    private LocalDateTime createdAt;
    private List<OrderItemResponse> items;
}
