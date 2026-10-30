package com.example.OpsPilot.service;

import com.example.OpsPilot.dto.WorkloadDTO;
import com.example.OpsPilot.entity.Deployment;
import com.example.OpsPilot.entity.Pod;
import com.example.OpsPilot.entity.K8sService;
import com.example.OpsPilot.repository.DeploymentRepository;
import com.example.OpsPilot.repository.PodRepository;
import com.example.OpsPilot.repository.K8sServiceRepository;
import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class WorkloadService {

    private final DeploymentRepository deploymentRepository;
    private final PodRepository podRepository;
    private final K8sServiceRepository k8sServiceRepository;
    private final ObjectMapper objectMapper;

    public List<WorkloadDTO.DeploymentDTO> getDeployments(String namespace) {
        List<Deployment> deployments = (namespace == null || namespace.equals("all"))
                ? deploymentRepository.findAll()
                : deploymentRepository.findByNamespace(namespace);
        return deployments.stream().map(this::toDeploymentDTO).collect(Collectors.toList());
    }

    public List<WorkloadDTO.PodDTO> getPods(String namespace) {
        List<Pod> pods = (namespace == null || namespace.equals("all"))
                ? podRepository.findAll()
                : podRepository.findByNamespace(namespace);
        return pods.stream().map(this::toPodDTO).collect(Collectors.toList());
    }

    public List<WorkloadDTO.ServiceDTO> getServices(String namespace) {
        List<K8sService> services = (namespace == null || namespace.equals("all"))
                ? k8sServiceRepository.findAll()
                : k8sServiceRepository.findByNamespace(namespace);
        return services.stream().map(this::toServiceDTO).collect(Collectors.toList());
    }

    public WorkloadDTO.WorkloadSummaryDTO getWorkloadSummary() {
        List<Deployment> deps = deploymentRepository.findAll();
        List<Pod> pods = podRepository.findAll();
        List<K8sService> svcs = k8sServiceRepository.findAll();

        long healthy = deps.stream().filter(d -> "Healthy".equalsIgnoreCase(d.getStatus())).count();
        long degraded = deps.stream().filter(d -> !"Healthy".equalsIgnoreCase(d.getStatus())).count();
        long running = pods.stream().filter(p -> "Running".equalsIgnoreCase(p.getStatus())).count();
        long crash = pods.stream().filter(p -> "CrashLoopBackOff".equalsIgnoreCase(p.getStatus())).count();

        return WorkloadDTO.WorkloadSummaryDTO.builder()
                .deployments(WorkloadDTO.WorkloadSummaryDTO.DeploymentStat.builder()
                        .total(deps.size()).healthy((int) healthy).degraded((int) degraded).build())
                .pods(WorkloadDTO.WorkloadSummaryDTO.PodStat.builder()
                        .total(pods.size()).running((int) running).crashloop((int) crash).build())
                .services(WorkloadDTO.WorkloadSummaryDTO.ServiceStat.builder()
                        .total(svcs.size()).build())
                .build();
    }

    private WorkloadDTO.DeploymentDTO toDeploymentDTO(Deployment d) {
        return WorkloadDTO.DeploymentDTO.builder()
                .id(d.getId()).name(d.getName()).namespace(d.getNamespace())
                .desiredReplicas(d.getDesiredReplicas()).readyReplicas(d.getReadyReplicas())
                .status(d.getStatus()).image(d.getImage()).version(d.getVersion())
                .restarts(d.getRestarts()).cpuRequest(d.getCpuRequest()).cpuLimit(d.getCpuLimit())
                .memoryRequest(d.getMemoryRequest()).memoryLimit(d.getMemoryLimit())
                .createdAt(d.getCreatedAt()).strategy(d.getStrategy())
                .events(parseJsonList(d.getEventsJson(), new TypeReference<List<WorkloadDTO.WorkloadEventDTO>>() {}))
                .build();
    }

    private WorkloadDTO.PodDTO toPodDTO(Pod p) {
        return WorkloadDTO.PodDTO.builder()
                .id(p.getId()).name(p.getName()).namespace(p.getNamespace())
                .node(p.getNode()).status(p.getStatus()).readyContainers(p.getReadyContainers())
                .restarts(p.getRestarts()).cpu(p.getCpu()).memory(p.getMemory())
                .ip(p.getIp()).age(p.getAge())
                .events(parseJsonList(p.getEventsJson(), new TypeReference<List<WorkloadDTO.WorkloadEventDTO>>() {}))
                .build();
    }

    private WorkloadDTO.ServiceDTO toServiceDTO(K8sService s) {
        Map<String, String> selector = parseJson(s.getSelectorJson(), new TypeReference<Map<String, String>>() {});
        List<WorkloadDTO.ServicePortDTO> ports = parseJsonList(s.getPortsJson(), new TypeReference<List<WorkloadDTO.ServicePortDTO>>() {});
        return WorkloadDTO.ServiceDTO.builder()
                .id(s.getId()).name(s.getName()).namespace(s.getNamespace())
                .type(s.getType()).clusterIP(s.getClusterIP()).externalIP(s.getExternalIP())
                .endpointsCount(s.getEndpointsCount()).age(s.getAge())
                .ports(ports).selector(selector)
                .build();
    }

    private <T> List<T> parseJsonList(String json, TypeReference<List<T>> type) {
        if (json == null || json.isBlank()) return List.of();
        try { return objectMapper.readValue(json, type); } catch (Exception e) { return List.of(); }
    }

    private <T> T parseJson(String json, TypeReference<T> type) {
        if (json == null || json.isBlank()) return null;
        try { return objectMapper.readValue(json, type); } catch (Exception e) { return null; }
    }
}
