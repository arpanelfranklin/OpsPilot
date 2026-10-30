package com.example.OpsPilot.entity;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "cluster_infos")
@Builder
@Data
@NoArgsConstructor
@AllArgsConstructor
public class ClusterInfo {

    @Id
    private String id;

    private String clusterKey;     // lookup key e.g. "production-us-east"
    private String name;
    private String environment;    // Production | Staging | Development
    private String status;         // Healthy | Degraded | Critical
    private String k8sVersion;
    private Integer namespacesCount;
    private Integer nodeCount;
    private Integer podsRunning;
    private Integer podsTotal;
    private Integer cpuUsagePercent;
    private Integer memoryUsagePercent;
    private String networkThroughput;
    private String uptime;
}
