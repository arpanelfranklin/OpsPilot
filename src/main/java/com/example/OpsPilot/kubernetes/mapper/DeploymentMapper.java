package com.example.OpsPilot.kubernetes.mapper;

import com.example.OpsPilot.kubernetes.dto.K8sDeploymentDTO;
import io.kubernetes.client.openapi.models.V1Deployment;
import io.kubernetes.client.openapi.models.V1DeploymentCondition;
import org.springframework.stereotype.Component;

import java.util.List;
import java.util.Objects;
import java.util.stream.Collectors;

@Component
public class DeploymentMapper {

    public K8sDeploymentDTO toDTO(V1Deployment d) {
        var meta = Objects.requireNonNull(d.getMetadata());
        var spec = d.getSpec();
        var status = d.getStatus();

        // Collect container images from the pod template spec
        List<String> images = List.of();
        if (spec != null && spec.getTemplate().getSpec() != null
                && spec.getTemplate().getSpec().getContainers() != null) {
            images = spec.getTemplate().getSpec().getContainers().stream()
                    .map(c -> c.getImage() != null ? c.getImage() : "unknown")
                    .collect(Collectors.toList());
        }

        // Find the most relevant condition (Available takes priority)
        String condition = null;
        if (status != null && status.getConditions() != null) {
            condition = status.getConditions().stream()
                    .filter(c -> "True".equals(c.getStatus()))
                    .map(V1DeploymentCondition::getType)
                    .findFirst().orElse(null);
        }

        return K8sDeploymentDTO.builder()
                .name(meta.getName())
                .namespace(meta.getNamespace())
                .desiredReplicas(spec != null && spec.getReplicas() != null ? spec.getReplicas() : 0)
                .readyReplicas(status != null && status.getReadyReplicas() != null ? status.getReadyReplicas() : 0)
                .availableReplicas(status != null && status.getAvailableReplicas() != null ? status.getAvailableReplicas() : 0)
                .updatedReplicas(status != null && status.getUpdatedReplicas() != null ? status.getUpdatedReplicas() : 0)
                .images(images)
                .creationTimestamp(meta.getCreationTimestamp() != null ? meta.getCreationTimestamp().toString() : null)
                .condition(condition)
                .build();
    }
}
