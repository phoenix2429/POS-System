package com.pos.backend.service;

import com.pos.backend.dto.OrderRequest;
import com.pos.backend.dto.OrderResponse;
import java.util.List;

public interface OrderService {
    OrderResponse createOrder(OrderRequest request);
    List<OrderResponse> getAllOrders();
}
