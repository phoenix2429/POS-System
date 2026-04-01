package com.pos.backend.service.impl;

import com.pos.backend.dto.DashboardSummary;
import com.pos.backend.repository.OrderRepository;
import com.pos.backend.service.DashboardService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;

@Service
@RequiredArgsConstructor
public class DashboardServiceImpl implements DashboardService {

    private final OrderRepository orderRepository;

    @Override
    public DashboardSummary getSummary() {
        long totalOrders = orderRepository.count();
        BigDecimal totalSales = orderRepository.sumTotalSales();
        
        if (totalSales == null) {
            totalSales = BigDecimal.ZERO;
        }

        LocalDateTime startOfDay = LocalDate.now().atStartOfDay();
        LocalDateTime endOfDay = startOfDay.plusDays(1);
        
        BigDecimal todaySales = orderRepository.sumTotalSalesBetween(startOfDay, endOfDay);
        if (todaySales == null) {
            todaySales = BigDecimal.ZERO;
        }

        return DashboardSummary.builder()
                .totalSales(totalSales)
                .totalOrders(totalOrders)
                .todaySales(todaySales)
                .build();
    }
}
