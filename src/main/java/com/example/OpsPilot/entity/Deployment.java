package com.example.OpsPilot.entity;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "deployments")
@Builder
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Deployment {

    @Id
    private String id;

    private String name;
    private String namespace;
    private Integer desiredReplicas;
    private Integer readyReplicas;
    private String status;          // Healthy | Degraded | Critical
    private String image;
    private String version;
    private Integer restarts;
    private String cpuRequest;
    private String cpuLimit;
    private String memoryRequest;
    private String memoryLimit;
    private String createdAt;
    private String strategy;

    @Column(columnDefinition = "TEXT")
    private String eventsJson;     // serialised List<WorkloadEvent>
}
