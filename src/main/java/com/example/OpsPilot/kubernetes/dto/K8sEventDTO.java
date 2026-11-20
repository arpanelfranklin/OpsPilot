package com.example.OpsPilot.kubernetes.dto;

import lombok.Builder;
import lombok.Data;

@Data @Builder
public class K8sEventDTO {
    private String name;
    private String namespace;
    private String involvedObject;
    private String reason;
    private String message;
    private String type;            // Normal | Warning
    private int count;
    private String firstTimestamp;
    private String lastTimestamp;
    private String reportingComponent;
}
