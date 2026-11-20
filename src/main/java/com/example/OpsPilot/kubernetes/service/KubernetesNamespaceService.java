package com.example.OpsPilot.kubernetes.service;

import com.example.OpsPilot.kubernetes.dto.K8sNamespaceDTO;
import com.example.OpsPilot.kubernetes.exception.KubernetesException;
import io.kubernetes.client.openapi.ApiClient;
import io.kubernetes.client.openapi.ApiException;
import io.kubernetes.client.openapi.apis.CoreV1Api;
import io.kubernetes.client.openapi.models.V1Namespace;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Objects;

@Service
@RequiredArgsConstructor
@Slf4j
public class KubernetesNamespaceService {

    private final ApiClient apiClient;

    public List<K8sNamespaceDTO> listNamespaces() {
        try {
            CoreV1Api api = new CoreV1Api(apiClient);
            return api.listNamespace().execute().getItems().stream()
                    .map(this::toDTO)
                    .toList();
        } catch (ApiException e) {
            log.error("Failed to list namespaces: {} {}", e.getCode(), e.getResponseBody());
            throw KubernetesClusterService.mapApiException("Failed to list namespaces", e);
        } catch (Exception e) {
            log.error("Unexpected error listing namespaces", e);
            throw new KubernetesException("Failed to list namespaces: " + e.getMessage(), 503, e);
        }
    }

    private K8sNamespaceDTO toDTO(V1Namespace ns) {
        String status = "Unknown";
        if (ns.getStatus() != null && ns.getStatus().getPhase() != null) {
            status = ns.getStatus().getPhase();
        }
        String ts = null;
        if (ns.getMetadata() != null && ns.getMetadata().getCreationTimestamp() != null) {
            ts = ns.getMetadata().getCreationTimestamp().toString();
        }
        return K8sNamespaceDTO.builder()
                .name(Objects.requireNonNull(ns.getMetadata(), "namespace metadata").getName())
                .status(status)
                .creationTimestamp(ts)
                .build();
    }
}
