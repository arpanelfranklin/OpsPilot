package com.example.OpsPilot.kubernetes.service;

import com.example.OpsPilot.kubernetes.dto.PodLogDTO;
import com.example.OpsPilot.kubernetes.exception.KubernetesException;
import io.kubernetes.client.openapi.ApiClient;
import io.kubernetes.client.openapi.ApiException;
import io.kubernetes.client.openapi.apis.CoreV1Api;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.time.Instant;
import java.util.Arrays;
import java.util.List;

@Service
@RequiredArgsConstructor
@Slf4j
public class KubernetesLogService {

    private static final int MAX_TAIL_LINES = 500;
    private static final int DEFAULT_TAIL_LINES = 100;

    private final ApiClient apiClient;

    /**
     * Retrieve logs from a specific container inside a pod.
     * Enforces a hard maximum of 500 lines and validates all input parameters.
     */
    public PodLogDTO getPodLogs(String namespace, String podName, String container,
                                Integer tailLines, boolean previous) {
        validateNames(namespace, podName);
        int lines = (tailLines == null || tailLines <= 0) ? DEFAULT_TAIL_LINES : Math.min(tailLines, MAX_TAIL_LINES);

        try {
            CoreV1Api api = new CoreV1Api(apiClient);

            var call = api.readNamespacedPodLog(podName, namespace);
            if (container != null && !container.isBlank()) {
                call = call.container(container);
            }
            call = call.tailLines(lines).previous(previous);

            String raw = call.execute();

            List<String> logLines = (raw == null || raw.isBlank())
                    ? List.of()
                    : Arrays.asList(raw.split("\n"));

            return PodLogDTO.builder()
                    .namespace(namespace)
                    .podName(podName)
                    .containerName(container != null ? container : "")
                    .previous(previous)
                    .logs(logLines)
                    .retrievedAt(Instant.now().toString())
                    .dataSource("LIVE")
                    .build();

        } catch (ApiException e) {
            log.warn("Failed to get pod logs for {}/{}: {} {}", namespace, podName, e.getCode(), e.getResponseBody());
            if (e.getCode() == 404) throw new KubernetesException(
                    "Pod not found: " + namespace + "/" + podName, 404, e);
            if (e.getCode() == 400 && e.getResponseBody() != null && e.getResponseBody().contains("container")) {
                throw new KubernetesException(
                        "Container not found or not ready. Check container name.", 400, e);
            }
            throw KubernetesClusterService.mapApiException("Failed to retrieve logs", e);
        } catch (Exception e) {
            log.error("Unexpected error retrieving logs for {}/{}", namespace, podName, e);
            throw new KubernetesException("Failed to retrieve logs: " + e.getMessage(), 503, e);
        }
    }

    private void validateNames(String namespace, String podName) {
        if (namespace == null || namespace.isBlank()) throw new IllegalArgumentException("Namespace is required");
        if (podName == null || podName.isBlank()) throw new IllegalArgumentException("Pod name is required");
        if (!namespace.matches("[a-z0-9][a-z0-9\\-]{0,62}")) throw new IllegalArgumentException("Invalid namespace name");
        if (!podName.matches("[a-z0-9][a-z0-9\\-.]{0,252}")) throw new IllegalArgumentException("Invalid pod name");
    }
}
