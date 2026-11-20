package com.example.OpsPilot.kubernetes.dto;

import lombok.Builder;
import lombok.Data;
import java.util.List;

@Data @Builder
public class K8sDeploymentDTO {
    private String name;
    private String namespace;
    private int desiredReplicas;
    private int readyReplicas;
    private int availableReplicas;
    private int updatedReplicas;
    private List<String> images;
    private String creationTimestamp;
    private String condition;       // Available | Progressing | etc.
}
