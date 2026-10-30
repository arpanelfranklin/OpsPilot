package com.example.OpsPilot.entity;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "metric_data_points")
@Builder
@Data
@NoArgsConstructor
@AllArgsConstructor
public class MetricDataPoint {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String timestamp;
    private String time;
    private Integer cpu;
    private Integer memory;
    private Integer network;
}
