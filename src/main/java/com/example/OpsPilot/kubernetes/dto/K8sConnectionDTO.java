package com.example.OpsPilot.kubernetes.dto;

import lombok.Builder;
import lombok.Data;

@Data @Builder
public class K8sConnectionDTO {
    private boolean connected;
    private String clusterName;
    private String kubernetesVersion;
    private String dataSource;   // "LIVE" | "UNAVAILABLE"
    private String message;
}
