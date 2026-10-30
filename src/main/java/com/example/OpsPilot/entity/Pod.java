package com.example.OpsPilot.entity;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "pods")
@Builder
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Pod {

    @Id
    private String id;

    private String name;
    private String namespace;
    private String node;
    private String status;           // Running | CrashLoopBackOff | Pending | Error | Completed | Terminating
    private String readyContainers;  // e.g. "1/1"
    private Integer restarts;
    private String cpu;
    private String memory;
    private String ip;
    private String age;

    @Column(columnDefinition = "TEXT")
    private String eventsJson;
}
