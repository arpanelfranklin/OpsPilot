package com.example.OpsPilot.dto;

import lombok.*;
import java.util.List;

@Data
@Builder

public class ClusterDTO {

    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class ClusterInfoDTO {
        private String id;
        private String name;
        private String environment;
        private String status;
        private String k8sVersion;
        private Integer namespacesCount;
        private Integer nodeCount;
        private PodCount podCount;
        private Integer cpuUsagePercent;
        private Integer memoryUsagePercent;
        private String networkThroughput;
        private String uptime;

        @Data
        @Builder
        @NoArgsConstructor
        @AllArgsConstructor
        public static class PodCount {
            private Integer running;
            private Integer total;
        }
    }

    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class ClusterSummaryDTO {
        private String id;
        private String name;
        private String environment;
    }

    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class NodeDTO {
        private String id;
        private String name;
        private String status;
        private List<String> roles;
        private Integer cpuUsagePercent;
        private Integer cpuCores;
        private Integer memoryUsagePercent;
        private Integer memoryCapacityGiB;
        private Integer podCount;
        private Integer podCapacity;
        private String kubeletVersion;
        private String ipAddress;
        private String zone;
    }
}
