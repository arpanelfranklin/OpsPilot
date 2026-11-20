package com.example.OpsPilot.kubernetes.service;

import com.example.OpsPilot.kubernetes.dto.K8sConnectionDTO;
import com.example.OpsPilot.kubernetes.dto.K8sNodeDTO;
import com.example.OpsPilot.kubernetes.exception.KubernetesException;
import com.example.OpsPilot.kubernetes.mapper.NodeMapper;
import io.kubernetes.client.openapi.ApiClient;
import io.kubernetes.client.openapi.ApiException;
import io.kubernetes.client.openapi.apis.CoreV1Api;
import io.kubernetes.client.openapi.apis.VersionApi;
import io.kubernetes.client.openapi.models.V1NodeList;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
@Slf4j
public class KubernetesClusterService {

    private final ApiClient apiClient;
    private final NodeMapper nodeMapper;

    /** Check cluster connectivity and return version info. */
    public K8sConnectionDTO checkConnection() {
        try {
            VersionApi versionApi = new VersionApi(apiClient);
            var versionInfo = versionApi.getCode().execute();
            return K8sConnectionDTO.builder()
                    .connected(true)
                    .clusterName(resolveClusterName())
                    .kubernetesVersion(versionInfo.getGitVersion())
                    .dataSource("LIVE")
                    .message("Successfully connected to Kubernetes")
                    .build();
        } catch (ApiException e) {
            log.warn("Kubernetes connection check failed — status {}: {}", e.getCode(), e.getMessage());
            return K8sConnectionDTO.builder()
                    .connected(false)
                    .dataSource("UNAVAILABLE")
                    .message("Unable to connect to Kubernetes cluster")
                    .build();
        } catch (Exception e) {
            log.warn("Kubernetes connection check failed: {}", e.getMessage());
            return K8sConnectionDTO.builder()
                    .connected(false)
                    .dataSource("UNAVAILABLE")
                    .message("Unable to connect to Kubernetes cluster")
                    .build();
        }
    }

    /** List all cluster nodes with status derived from conditions. */
    public List<K8sNodeDTO> listNodes() {
        try {
            CoreV1Api api = new CoreV1Api(apiClient);
            V1NodeList nodeList = api.listNode().execute();
            return nodeList.getItems().stream()
                    .map(nodeMapper::toDTO)
                    .toList();
        } catch (ApiException e) {
            log.error("Failed to list nodes: {} {}", e.getCode(), e.getResponseBody());
            throw mapApiException("Failed to list nodes", e);
        } catch (Exception e) {
            log.error("Unexpected error listing nodes", e);
            throw new KubernetesException("Failed to list nodes: " + e.getMessage(), 503, e);
        }
    }

    private String resolveClusterName() {
        // Best-effort: read from system property, env var, or return generic label
        String name = System.getenv("KUBERNETES_CLUSTER_NAME");
        return (name != null && !name.isBlank()) ? name : "opspilot-cluster";
    }

    static KubernetesException mapApiException(String context, ApiException e) {
        int status = switch (e.getCode()) {
            case 401 -> 401;
            case 403 -> 403;
            case 404 -> 404;
            default  -> 503;
        };
        return new KubernetesException(context + ": " + e.getMessage(), status, e);
    }
}
