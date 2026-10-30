package com.example.OpsPilot.dto;

import lombok.*;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ActivityEventDTO {

    private String id;
    private String time;
    private String title;
    private String description;
    private String type;
    private String severity;
}
