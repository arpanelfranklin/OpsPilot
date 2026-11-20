package com.example.OpsPilot.kubernetes.dto;

import lombok.Builder;
import lombok.Data;

@Data @Builder
public class K8sNamespaceDTO {
    private String name;
    private String status;
    private String creationTimestamp;
}
