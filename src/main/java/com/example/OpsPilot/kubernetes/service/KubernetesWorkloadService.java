package com.example.OpsPilot.kubernetes.service;

import com.example.OpsPilot.kubernetes.dto.K8sDeploymentDTO;
import com.example.OpsPilot.kubernetes.dto.K8sPodDTO;
import com.example.OpsPilot.kubernetes.dto.K8sServiceDTO;
import com.example.OpsPilot.kubernetes.exception.KubernetesException;
import com.example.OpsPilot.kubernetes.mapper.DeploymentMapper;
import com.example.OpsPilot.kubernetes.mapper.PodMapper;
import io.kubernetes.client.openapi.ApiClient;
import io.kubernetes.client.openapi.ApiException;
import io.kubernetes.client.openapi.apis.AppsV1Api;
import io.kubernetes.client.openapi.apis.CoreV1Api;
import io.kubernetes.client.openapi.models.*;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;
import java.util.Objects;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Slf4j
public class KubernetesWorkloadService {

    private final ApiClient apiClient;
    private final PodMapper podMapper;
    private final DeploymentMapper deploymentMapper;

    // ── Pods ──────────────────────────────────────────────────────────────────

    public List<K8sPodDTO> listPods(String namespace) {
        try {
            CoreV1Api api = new CoreV1Api(apiClient);
            V1PodList podList = (namespace != null && !namespace.isBlank())
                    ? api.listNamespacedPod(namespace).execute()
                    : api.listPodForAllNamespaces().execute();
            return podList.getItems().stream().map(podMapper::toDTO).toList();
        } catch (ApiException e) {
            log.error("Failed to list pods: {} {}", e.getCode(), e.getResponseBody());
            throw KubernetesClusterService.mapApiException("Failed to list pods", e);
        } catch (Exception e) {
            log.error("Unexpected error listing pods", e);
            throw new KubernetesException("Failed to list pods: " + e.getMessage(), 503, e);
        }
    }

    public K8sPodDTO getPodDetails(String namespace, String podName) {
        validateNames(namespace, podName);
        try {
            CoreV1Api api = new CoreV1Api(apiClient);
            V1Pod pod = api.readNamespacedPod(podName, namespace).execute();
            return podMapper.toDTO(pod);
        } catch (ApiException e) {
            if (e.getCode() == 404) throw new KubernetesException(
                    "Pod not found: " + namespace + "/" + podName, 404, e);
            throw KubernetesClusterService.mapApiException("Failed to get pod details", e);
        } catch (Exception e) {
            log.error("Unexpected error getting pod details", e);
            throw new KubernetesException("Failed to get pod details: " + e.getMessage(), 503, e);
        }
    }

    // ── Deployments ───────────────────────────────────────────────────────────

    public List<K8sDeploymentDTO> listDeployments(String namespace) {
        try {
            AppsV1Api api = new AppsV1Api(apiClient);
            V1DeploymentList list = (namespace != null && !namespace.isBlank())
                    ? api.listNamespacedDeployment(namespace).execute()
                    : api.listDeploymentForAllNamespaces().execute();
            return list.getItems().stream().map(deploymentMapper::toDTO).toList();
        } catch (ApiException e) {
            log.error("Failed to list deployments: {} {}", e.getCode(), e.getResponseBody());
            throw KubernetesClusterService.mapApiException("Failed to list deployments", e);
        } catch (Exception e) {
            log.error("Unexpected error listing deployments", e);
            throw new KubernetesException("Failed to list deployments: " + e.getMessage(), 503, e);
        }
    }

    // ── Services ──────────────────────────────────────────────────────────────

    public List<K8sServiceDTO> listServices(String namespace) {
        try {
            CoreV1Api api = new CoreV1Api(apiClient);
            V1ServiceList list = (namespace != null && !namespace.isBlank())
                    ? api.listNamespacedService(namespace).execute()
                    : api.listServiceForAllNamespaces().execute();
            return list.getItems().stream().map(this::toServiceDTO).toList();
        } catch (ApiException e) {
            log.error("Failed to list services: {} {}", e.getCode(), e.getResponseBody());
            throw KubernetesClusterService.mapApiException("Failed to list services", e);
        } catch (Exception e) {
            log.error("Unexpected error listing services", e);
            throw new KubernetesException("Failed to list services: " + e.getMessage(), 503, e);
        }
    }

    private K8sServiceDTO toServiceDTO(V1Service svc) {
        var meta = Objects.requireNonNull(svc.getMetadata());
        var spec = svc.getSpec();
        List<String> ports = new ArrayList<>();
        if (spec != null && spec.getPorts() != null) {
            for (var p : spec.getPorts()) {
                String portStr = p.getPort() + ":" + (p.getNodePort() != null ? p.getNodePort() : "-") + "/" + p.getProtocol();
                ports.add(portStr);
            }
        }
        return K8sServiceDTO.builder()
                .name(meta.getName())
                .namespace(meta.getNamespace())
                .type(spec != null ? spec.getType() : null)
                .clusterIP(spec != null ? spec.getClusterIP() : null)
                .externalIPs(spec != null && spec.getExternalIPs() != null ? spec.getExternalIPs() : List.of())
                .ports(ports)
                .selector(spec != null ? spec.getSelector() : null)
                .creationTimestamp(meta.getCreationTimestamp() != null ? meta.getCreationTimestamp().toString() : null)
                .build();
    }

    private void validateNames(String namespace, String podName) {
        if (namespace == null || namespace.isBlank()) throw new IllegalArgumentException("Namespace is required");
        if (podName == null || podName.isBlank()) throw new IllegalArgumentException("Pod name is required");
        if (!namespace.matches("[a-z0-9][a-z0-9\\-]{0,62}")) throw new IllegalArgumentException("Invalid namespace name");
        if (!podName.matches("[a-z0-9][a-z0-9\\-.]{0,252}")) throw new IllegalArgumentException("Invalid pod name");
    }
}
