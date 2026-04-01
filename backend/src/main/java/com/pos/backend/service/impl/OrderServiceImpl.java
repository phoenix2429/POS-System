package com.pos.backend.service.impl;

import com.pos.backend.dto.OrderItemRequest;
import com.pos.backend.dto.OrderItemResponse;
import com.pos.backend.dto.OrderRequest;
import com.pos.backend.dto.OrderResponse;
import com.pos.backend.entity.Item;
import com.pos.backend.entity.Order;
import com.pos.backend.entity.OrderItem;
import com.pos.backend.entity.OrderStatus;
import com.pos.backend.entity.PaymentMethod;
import com.pos.backend.repository.ItemRepository;
import com.pos.backend.repository.OrderRepository;
import com.pos.backend.service.OrderService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class OrderServiceImpl implements OrderService {

    private final OrderRepository orderRepository;
    private final ItemRepository itemRepository;

    @Override
    @Transactional
    public OrderResponse createOrder(OrderRequest request) {
        Order order = Order.builder()
                .customerName(request.getCustomerName())
                .phone(request.getPhone())
                .paymentType(PaymentMethod.valueOf(request.getPaymentType().toUpperCase()))
                .status(OrderStatus.SUCCESS)
                .items(new ArrayList<>())
                .build();

        BigDecimal totalAmount = BigDecimal.ZERO;

        for (OrderItemRequest itemRequest : request.getItems()) {
            Item item = itemRepository.findById(itemRequest.getItemId())
                    .orElseThrow(() -> new RuntimeException("Item not found"));
            
            BigDecimal price = item.getPrice();
            int quantity = itemRequest.getQuantity();
            BigDecimal subTotal = price.multiply(BigDecimal.valueOf(quantity));
            
            OrderItem orderItem = OrderItem.builder()
                    .item(item)
                    .quantity(quantity)
                    .price(price)
                    .order(order)
                    .build();
            
            order.getItems().add(orderItem);
            totalAmount = totalAmount.add(subTotal);
        }

        // Generic 5% tax for simplicity, round to 2 decimals
        BigDecimal tax = totalAmount.multiply(BigDecimal.valueOf(0.05));
        
        order.setTotalAmount(totalAmount.add(tax));
        order.setTax(tax);

        order = orderRepository.save(order);

        // Normally we'd integrate a payment gateway here.
        return mapToDto(order);
    }

    @Override
    public List<OrderResponse> getAllOrders() {
        return orderRepository.findAll().stream()
                .map(this::mapToDto)
                .collect(Collectors.toList());
    }

    private OrderResponse mapToDto(Order order) {
        List<OrderItemResponse> itemResponses = order.getItems().stream()
                .map(oi -> OrderItemResponse.builder()
                        .id(oi.getId())
                        .itemName(oi.getItem().getName())
                        .price(oi.getPrice())
                        .quantity(oi.getQuantity())
                        .subTotal(oi.getPrice().multiply(BigDecimal.valueOf(oi.getQuantity())))
                        .build())
                .collect(Collectors.toList());

        return OrderResponse.builder()
                .id(order.getId())
                .customerName(order.getCustomerName())
                .phone(order.getPhone())
                .totalAmount(order.getTotalAmount())
                .tax(order.getTax())
                .paymentType(order.getPaymentType().name())
                .status(order.getStatus().name())
                .createdAt(order.getCreatedAt())
                .items(itemResponses)
                .build();
    }
}
