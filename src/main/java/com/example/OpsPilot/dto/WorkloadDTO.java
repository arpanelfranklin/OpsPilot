package com.example.OpsPilot.dto;

import lombok.*;
import java.util.List;
import java.util.Map;

@Data
@Builder

public class WorkloadDTO {

    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class WorkloadEventDTO {
        private String id;
        private String type;
        private String reason;
        private String message;
        private String timestamp;
        private Integer count;
    }

    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class DeploymentDTO {
        private String id;
        private String name;
        private String namespace;
        private Integer desiredReplicas;
        private Integer readyReplicas;
        private String status;
        private String image;
        private String version;
        private Integer restarts;
        private String cpuRequest;
        private String cpuLimit;
        private String memoryRequest;
        private String memoryLimit;
        private String createdAt;
        private String strategy;
        private List<WorkloadEventDTO> events;
    }

    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class PodDTO {
        private String id;
        private String name;
        private String namespace;
        private String node;
        private String status;
        private String readyContainers;
        private Integer restarts;
        private String cpu;
        private String memory;
        private String ip;
        private String age;
        private List<WorkloadEventDTO> events;
    }

    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class ServicePortDTO {
        private String name;
        private String protocol;
        private Integer port;
        private Object targetPort;
        private Integer nodePort;
    }

    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class ServiceDTO {
        private String id;
        private String name;
        private String namespace;
        private String type;
        private String clusterIP;
        private String externalIP;
        private List<ServicePortDTO> ports;
        private Integer endpointsCount;
        private Map<String, String> selector;
        private String age;
    }

    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class WorkloadSummaryDTO {
        private DeploymentStat deployments;
        private PodStat pods;
        private ServiceStat services;

        @Data
        @Builder
        @NoArgsConstructor
        @AllArgsConstructor
        public static class DeploymentStat {
            private Integer total;
            private Integer healthy;
            private Integer degraded;
        }

        @Data
        @Builder
        @NoArgsConstructor
        @AllArgsConstructor
        public static class PodStat {
            private Integer total;
            private Integer running;
            private Integer crashloop;
        }

        @Data
        @Builder
        @NoArgsConstructor
        @AllArgsConstructor
        public static class ServiceStat {
            private Integer total;
        }
    }
}
