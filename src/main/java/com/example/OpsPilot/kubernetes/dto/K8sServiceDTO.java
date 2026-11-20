package com.example.OpsPilot.kubernetes.dto;

import lombok.Builder;
import lombok.Data;
import java.util.List;
import java.util.Map;

@Data @Builder
public class K8sServiceDTO {
    private String name;
    private String namespace;
    private String type;            // ClusterIP | NodePort | LoadBalancer
    private String clusterIP;
    private List<String> externalIPs;
    private List<String> ports;     // "80:30080/TCP"
    private Map<String, String> selector;
    private String creationTimestamp;
}
