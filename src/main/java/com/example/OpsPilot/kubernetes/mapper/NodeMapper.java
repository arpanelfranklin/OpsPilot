package com.example.OpsPilot.kubernetes.mapper;

import com.example.OpsPilot.kubernetes.dto.K8sNodeDTO;
import io.kubernetes.client.openapi.models.V1Node;
import io.kubernetes.client.openapi.models.V1NodeCondition;
import org.springframework.stereotype.Component;

import java.util.LinkedHashMap;
import java.util.Map;
import java.util.Objects;

@Component
public class NodeMapper {

    public K8sNodeDTO toDTO(V1Node node) {
        var meta = Objects.requireNonNull(node.getMetadata());
        var status = node.getStatus();

        // Derive roles from labels
        String roles = "worker";
        if (meta.getLabels() != null) {
            if (meta.getLabels().containsKey("node-role.kubernetes.io/control-plane")
                    || meta.getLabels().containsKey("node-role.kubernetes.io/master")) {
                roles = "control-plane";
            }
        }

        // Determine readiness from conditions
        String readyStatus = "Unknown";
        if (status != null && status.getConditions() != null) {
            for (V1NodeCondition cond : status.getConditions()) {
                if ("Ready".equals(cond.getType())) {
                    readyStatus = "True".equals(cond.getStatus()) ? "Ready" : "NotReady";
                    break;
                }
            }
        }

        // Capacity and allocatable
        Map<String, String> capacity = new LinkedHashMap<>();
        Map<String, String> allocatable = new LinkedHashMap<>();
        if (status != null) {
            if (status.getCapacity() != null)
                status.getCapacity().forEach((k, v) -> capacity.put(k, v.toString()));
            if (status.getAllocatable() != null)
                status.getAllocatable().forEach((k, v) -> allocatable.put(k, v.toString()));
        }

        String kubeletVersion = null;
        String os = null;
        String arch = null;
        if (status != null && status.getNodeInfo() != null) {
            kubeletVersion = status.getNodeInfo().getKubeletVersion();
            os = status.getNodeInfo().getOperatingSystem();
            arch = status.getNodeInfo().getArchitecture();
        }

        return K8sNodeDTO.builder()
                .name(meta.getName())
                .status(readyStatus)
                .roles(roles)
                .kubeletVersion(kubeletVersion)
                .operatingSystem(os)
                .architecture(arch)
                .capacity(capacity)
                .allocatable(allocatable)
                .creationTimestamp(meta.getCreationTimestamp() != null ? meta.getCreationTimestamp().toString() : null)
                .build();
    }
}
