package com.example.OpsPilot.entity;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "k8s_services")
@Builder
@Data
@NoArgsConstructor
@AllArgsConstructor
public class K8sService {

    @Id
    private String id;

    private String name;
    private String namespace;
    private String type;        // ClusterIP | NodePort | LoadBalancer
    private String clusterIP;
    private String externalIP;
    private Integer endpointsCount;
    private String age;

    @Column(columnDefinition = "TEXT")
    private String portsJson;       // serialised List<ServicePort>

    @Column(columnDefinition = "TEXT")
    private String selectorJson;    // serialised Map<String, String>
}
