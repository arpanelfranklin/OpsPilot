package com.example.OpsPilot.kubernetes.dto;

import lombok.Builder;
import lombok.Data;
import java.util.List;

@Data @Builder
public class PodLogDTO {
    private String namespace;
    private String podName;
    private String containerName;
    private boolean previous;
    private List<String> logs;
    private String retrievedAt;
    private String dataSource;      // "LIVE"
}
