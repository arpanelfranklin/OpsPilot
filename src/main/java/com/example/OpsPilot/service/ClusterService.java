package com.example.OpsPilot.service;

import com.example.OpsPilot.dto.ClusterDTO;
import com.example.OpsPilot.dto.MetricDTO;
import com.example.OpsPilot.dto.ActivityEventDTO;
import com.example.OpsPilot.entity.ClusterInfo;
import com.example.OpsPilot.entity.Node;
import com.example.OpsPilot.entity.MetricDataPoint;
import com.example.OpsPilot.entity.ActivityEvent;
import com.example.OpsPilot.repository.ClusterInfoRepository;
import com.example.OpsPilot.repository.NodeRepository;
import com.example.OpsPilot.repository.MetricRepository;
import com.example.OpsPilot.repository.ActivityEventRepository;
import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class ClusterService {

    private final ClusterInfoRepository clusterInfoRepository;
    private final NodeRepository nodeRepository;
    private final MetricRepository metricRepository;
    private final ActivityEventRepository activityEventRepository;
    private final ObjectMapper objectMapper;

    public ClusterDTO.ClusterInfoDTO getClusterOverview(String clusterKey) {
        ClusterInfo info = clusterInfoRepository.findByClusterKey(clusterKey)
                .orElseGet(() -> clusterInfoRepository.findByClusterKey("production-us-east").orElseThrow());
        return toClusterInfoDTO(info);
    }

    public List<ClusterDTO.ClusterSummaryDTO> getAllClusters() {
        return clusterInfoRepository.findAll().stream()
                .map(c -> ClusterDTO.ClusterSummaryDTO.builder()
                        .id(c.getClusterKey()).name(c.getName()).environment(c.getEnvironment()).build())
                .collect(Collectors.toList());
    }

    public List<ClusterDTO.NodeDTO> getNodes() {
        return nodeRepository.findAll().stream().map(this::toNodeDTO).collect(Collectors.toList());
    }

    public List<MetricDTO> getResourceMetrics() {
        return metricRepository.findAll().stream()
                .map(m -> MetricDTO.builder()
                        .timestamp(m.getTimestamp()).time(m.getTime())
                        .cpu(m.getCpu()).memory(m.getMemory()).network(m.getNetwork()).build())
                .collect(Collectors.toList());
    }

    public List<ActivityEventDTO> getRecentActivities() {
        return activityEventRepository.findAll().stream()
                .map(a -> ActivityEventDTO.builder()
                        .id(a.getId()).time(a.getTime()).title(a.getTitle())
                        .description(a.getDescription()).type(a.getType()).severity(a.getSeverity()).build())
                .collect(Collectors.toList());
    }

    private ClusterDTO.ClusterInfoDTO toClusterInfoDTO(ClusterInfo info) {
        return ClusterDTO.ClusterInfoDTO.builder()
                .id(info.getId()).name(info.getName()).environment(info.getEnvironment())
                .status(info.getStatus()).k8sVersion(info.getK8sVersion())
                .namespacesCount(info.getNamespacesCount()).nodeCount(info.getNodeCount())
                .podCount(ClusterDTO.ClusterInfoDTO.PodCount.builder()
                        .running(info.getPodsRunning()).total(info.getPodsTotal()).build())
                .cpuUsagePercent(info.getCpuUsagePercent()).memoryUsagePercent(info.getMemoryUsagePercent())
                .networkThroughput(info.getNetworkThroughput()).uptime(info.getUptime())
                .build();
    }

    private ClusterDTO.NodeDTO toNodeDTO(Node n) {
        List<String> roles = null;
        if (n.getRolesJson() != null && !n.getRolesJson().isBlank()) {
            try { roles = objectMapper.readValue(n.getRolesJson(), new TypeReference<List<String>>() {}); }
            catch (Exception ignored) {}
        }
        return ClusterDTO.NodeDTO.builder()
                .id(n.getId()).name(n.getName()).status(n.getStatus()).roles(roles)
                .cpuUsagePercent(n.getCpuUsagePercent()).cpuCores(n.getCpuCores())
                .memoryUsagePercent(n.getMemoryUsagePercent()).memoryCapacityGiB(n.getMemoryCapacityGiB())
                .podCount(n.getPodCount()).podCapacity(n.getPodCapacity())
                .kubeletVersion(n.getKubeletVersion()).ipAddress(n.getIpAddress()).zone(n.getZone())
                .build();
    }
}
