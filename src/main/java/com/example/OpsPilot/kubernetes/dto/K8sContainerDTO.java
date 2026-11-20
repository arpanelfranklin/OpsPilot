package com.example.OpsPilot.kubernetes.dto;

import lombok.Builder;
import lombok.Data;
import java.util.Map;

@Data @Builder
public class K8sContainerDTO {
    private String name;
    private String image;
    private String state;           // Running | Waiting | Terminated
    private String waitingReason;   // e.g., CrashLoopBackOff
    private boolean ready;
    private int restartCount;
    private Map<String, String> resourceRequests;
    private Map<String, String> resourceLimits;
}
