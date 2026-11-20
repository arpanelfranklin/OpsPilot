package com.example.OpsPilot.kubernetes.dto;

import lombok.Builder;
import lombok.Data;
import java.util.List;
import java.util.Map;

@Data @Builder
public class K8sPodDTO {
    private String name;
    private String namespace;
    private String phase;
    private String displayStatus;   // enriched: CrashLoopBackOff, ImagePullBackOff, etc.
    private String podIP;
    private String nodeName;
    private int restartCount;
    private String creationTimestamp;
    private Map<String, String> labels;
    private List<K8sContainerDTO> containers;
    private boolean ready;
}
