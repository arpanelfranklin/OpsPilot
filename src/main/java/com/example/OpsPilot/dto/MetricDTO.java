package com.example.OpsPilot.dto;

import lombok.*;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class MetricDTO {

    private String timestamp;
    private String time;
    private Integer cpu;
    private Integer memory;
    private Integer network;
}
