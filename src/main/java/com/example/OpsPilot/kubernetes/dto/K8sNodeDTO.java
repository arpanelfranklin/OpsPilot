package com.example.OpsPilot.kubernetes.dto;

import lombok.Builder;
import lombok.Data;
import java.util.Map;

@Data @Builder
public class K8sNodeDTO {
    private String name;
    private String status;          // Ready | NotReady | Unknown
    private String roles;           // control-plane | worker
    private String kubeletVersion;
    private String operatingSystem;
    private String architecture;
    private Map<String, String> capacity;
    private Map<String, String> allocatable;
    private String creationTimestamp;
}
