package com.example.OpsPilot.repository;

import com.example.OpsPilot.entity.MetricDataPoint;
import org.springframework.data.jpa.repository.JpaRepository;

public interface MetricRepository extends JpaRepository<MetricDataPoint, Long> {
}
