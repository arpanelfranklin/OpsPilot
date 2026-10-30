package com.example.OpsPilot.entity;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "nodes")
@Builder
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Node {

    @Id
    private String id;

    private String name;
    private String status;           // Ready | NotReady | SchedulingDisabled
    private Integer cpuUsagePercent;
    private Integer cpuCores;
    private Integer memoryUsagePercent;
    private Integer memoryCapacityGiB;
    private Integer podCount;
    private Integer podCapacity;
    private String kubeletVersion;
    private String ipAddress;
    private String zone;

    @Column(columnDefinition = "TEXT")
    private String rolesJson;        // serialised List<String>
}
