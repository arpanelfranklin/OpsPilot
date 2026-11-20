package com.example.OpsPilot.kubernetes.service;

import com.example.OpsPilot.kubernetes.dto.K8sEventDTO;
import com.example.OpsPilot.kubernetes.exception.KubernetesException;
import io.kubernetes.client.openapi.ApiClient;
import io.kubernetes.client.openapi.ApiException;
import io.kubernetes.client.openapi.apis.CoreV1Api;
import io.kubernetes.client.openapi.models.CoreV1Event;
import io.kubernetes.client.openapi.models.CoreV1EventList;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.util.Comparator;
import java.util.List;
import java.util.Objects;

@Service
@RequiredArgsConstructor
@Slf4j
public class KubernetesEventService {

    private final ApiClient apiClient;

    /** List events for a namespace, or all namespaces if namespace is blank. */
    public List<K8sEventDTO> listEvents(String namespace) {
        try {
            CoreV1Api api = new CoreV1Api(apiClient);
            CoreV1EventList list = (namespace != null && !namespace.isBlank())
                    ? api.listNamespacedEvent(namespace).execute()
                    : api.listEventForAllNamespaces().execute();

            return list.getItems().stream()
                    .map(this::toDTO)
                    .sorted(Comparator.comparing(K8sEventDTO::getLastTimestamp,
                            Comparator.nullsLast(Comparator.reverseOrder())))
                    .toList();
        } catch (ApiException e) {
            log.error("Failed to list events: {} {}", e.getCode(), e.getResponseBody());
            throw KubernetesClusterService.mapApiException("Failed to list events", e);
        } catch (Exception e) {
            log.error("Unexpected error listing events", e);
            throw new KubernetesException("Failed to list events: " + e.getMessage(), 503, e);
        }
    }

    /** List events for a specific pod within a namespace. */
    public List<K8sEventDTO> listPodEvents(String namespace, String podName) {
        if (namespace == null || namespace.isBlank()) throw new IllegalArgumentException("Namespace is required");
        if (podName == null || podName.isBlank()) throw new IllegalArgumentException("Pod name is required");

        return listEvents(namespace).stream()
                .filter(e -> e.getInvolvedObject() != null && e.getInvolvedObject().contains(podName))
                .toList();
    }

    private K8sEventDTO toDTO(CoreV1Event event) {
        var meta = Objects.requireNonNull(event.getMetadata());

        // Handle both legacy timestamp fields and newer eventTime
        String lastTs = null;
        if (event.getLastTimestamp() != null) {
            lastTs = event.getLastTimestamp().toString();
        } else if (event.getEventTime() != null) {
            lastTs = event.getEventTime().toString();
        }

        String firstTs = null;
        if (event.getFirstTimestamp() != null) {
            firstTs = event.getFirstTimestamp().toString();
        } else if (event.getEventTime() != null) {
            firstTs = event.getEventTime().toString();
        }

        String involvedObj = null;
        if (event.getInvolvedObject() != null) {
            involvedObj = event.getInvolvedObject().getKind() + "/" + event.getInvolvedObject().getName();
        }

        String reportingComponent = event.getReportingComponent();
        if ((reportingComponent == null || reportingComponent.isBlank()) && event.getSource() != null) {
            reportingComponent = event.getSource().getComponent();
        }

        return K8sEventDTO.builder()
                .name(meta.getName())
                .namespace(meta.getNamespace())
                .involvedObject(involvedObj)
                .reason(event.getReason())
                .message(event.getMessage())
                .type(event.getType())
                .count(event.getCount() != null ? event.getCount() : 0)
                .firstTimestamp(firstTs)
                .lastTimestamp(lastTs)
                .reportingComponent(reportingComponent)
                .build();
    }
}
