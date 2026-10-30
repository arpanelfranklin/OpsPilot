package com.example.OpsPilot.entity;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "activity_events")
@Builder
@Data
@NoArgsConstructor
@AllArgsConstructor
public class ActivityEvent {

    @Id
    private String id;

    private String time;
    private String title;
    private String description;
    private String type;       // ai | k8s | incident | system
    private String severity;   // info | warning | critical
}
