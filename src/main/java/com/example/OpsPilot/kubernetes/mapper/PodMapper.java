package com.example.OpsPilot.kubernetes.mapper;

import com.example.OpsPilot.kubernetes.dto.K8sContainerDTO;
import com.example.OpsPilot.kubernetes.dto.K8sPodDTO;
import io.kubernetes.client.openapi.models.*;
import org.springframework.stereotype.Component;

import java.util.*;
import java.util.stream.Collectors;

@Component
public class PodMapper {

    public K8sPodDTO toDTO(V1Pod pod) {
        var meta = Objects.requireNonNull(pod.getMetadata());
        var spec = pod.getSpec();
        var status = pod.getStatus();

        List<K8sContainerDTO> containers = buildContainerDTOs(spec, status);

        int totalRestarts = containers.stream().mapToInt(K8sContainerDTO::getRestartCount).sum();
        boolean ready = isReady(status);
        String displayStatus = resolveDisplayStatus(status, containers);

        return K8sPodDTO.builder()
                .name(meta.getName())
                .namespace(meta.getNamespace())
                .phase(status != null ? status.getPhase() : "Unknown")
                .displayStatus(displayStatus)
                .podIP(status != null ? status.getPodIP() : null)
                .nodeName(spec != null ? spec.getNodeName() : null)
                .restartCount(totalRestarts)
                .creationTimestamp(meta.getCreationTimestamp() != null ? meta.getCreationTimestamp().toString() : null)
                .labels(meta.getLabels())
                .containers(containers)
                .ready(ready)
                .build();
    }

    private List<K8sContainerDTO> buildContainerDTOs(V1PodSpec spec, V1PodStatus status) {
        if (spec == null || spec.getContainers() == null) return List.of();

        Map<String, V1ContainerStatus> statusMap = new HashMap<>();
        if (status != null && status.getContainerStatuses() != null) {
            for (V1ContainerStatus cs : status.getContainerStatuses()) {
                statusMap.put(cs.getName(), cs);
            }
        }

        return spec.getContainers().stream().map(c -> {
            V1ContainerStatus cs = statusMap.get(c.getName());
            return buildContainerDTO(c, cs);
        }).collect(Collectors.toList());
    }

    private K8sContainerDTO buildContainerDTO(V1Container container, V1ContainerStatus cs) {
        String state = "Unknown";
        String waitingReason = null;
        boolean ready = false;
        int restartCount = 0;

        if (cs != null) {
            ready = Boolean.TRUE.equals(cs.getReady());
            restartCount = cs.getRestartCount() != null ? cs.getRestartCount() : 0;
            V1ContainerState s = cs.getState();
            if (s != null) {
                if (s.getRunning() != null) state = "Running";
                else if (s.getWaiting() != null) {
                    state = "Waiting";
                    waitingReason = s.getWaiting().getReason();
                } else if (s.getTerminated() != null) state = "Terminated";
            }
        }

        Map<String, String> requests = new LinkedHashMap<>();
        Map<String, String> limits = new LinkedHashMap<>();
        if (container.getResources() != null) {
            if (container.getResources().getRequests() != null)
                container.getResources().getRequests().forEach((k, v) -> requests.put(k, v.toString()));
            if (container.getResources().getLimits() != null)
                container.getResources().getLimits().forEach((k, v) -> limits.put(k, v.toString()));
        }

        return K8sContainerDTO.builder()
                .name(container.getName())
                .image(container.getImage())
                .state(state)
                .waitingReason(waitingReason)
                .ready(ready)
                .restartCount(restartCount)
                .resourceRequests(requests)
                .resourceLimits(limits)
                .build();
    }

    /**
     * Enriches the pod phase with container waiting reasons.
     * CrashLoopBackOff is a container waiting reason, not a pod phase —
     * map it into displayStatus for accurate UI representation.
     */
    private String resolveDisplayStatus(V1PodStatus status, List<K8sContainerDTO> containers) {
        if (status == null) return "Unknown";
        // Check container waiting reasons first
        for (K8sContainerDTO c : containers) {
            String reason = c.getWaitingReason();
            if (reason != null && !reason.isBlank()) return reason; // e.g., CrashLoopBackOff
        }
        return status.getPhase() != null ? status.getPhase() : "Unknown";
    }

    private boolean isReady(V1PodStatus status) {
        if (status == null || status.getConditions() == null) return false;
        return status.getConditions().stream()
                .anyMatch(c -> "Ready".equals(c.getType()) && "True".equals(c.getStatus()));
    }
}
