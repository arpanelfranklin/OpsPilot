package com.example.OpsPilot.kubernetes.controller;

import com.example.OpsPilot.kubernetes.dto.*;
import com.example.OpsPilot.kubernetes.service.*;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

/**
 * Read-only Kubernetes REST API controller.
 * Base path: /api/v1/kubernetes
 *
 * SECURITY: This controller is strictly READ-ONLY.
 * No write, delete, patch, or scale operations are implemented.
 */
@RestController
@RequestMapping("/api/v1/kubernetes")
@RequiredArgsConstructor
public class KubernetesController {

    private final KubernetesClusterService   clusterService;
    private final KubernetesNamespaceService namespaceService;
    private final KubernetesWorkloadService  workloadService;
    private final KubernetesLogService       logService;
    private final KubernetesEventService     eventService;

    // ── A. Cluster Connection ─────────────────────────────────────────────────

    /** GET /api/v1/kubernetes/connection — cluster reachability check */
    @GetMapping("/connection")
    public ResponseEntity<K8sConnectionDTO> getConnection() {
        return ResponseEntity.ok(clusterService.checkConnection());
    }

    // ── B. Namespaces ─────────────────────────────────────────────────────────

    /** GET /api/v1/kubernetes/namespaces */
    @GetMapping("/namespaces")
    public ResponseEntity<List<K8sNamespaceDTO>> getNamespaces() {
        return ResponseEntity.ok(namespaceService.listNamespaces());
    }

    // ── C. Nodes ──────────────────────────────────────────────────────────────

    /** GET /api/v1/kubernetes/nodes */
    @GetMapping("/nodes")
    public ResponseEntity<List<K8sNodeDTO>> getNodes() {
        return ResponseEntity.ok(clusterService.listNodes());
    }

    // ── D & E. Pods ───────────────────────────────────────────────────────────

    /** GET /api/v1/kubernetes/pods?namespace=opspilot-demo */
    @GetMapping("/pods")
    public ResponseEntity<List<K8sPodDTO>> getPods(
            @RequestParam(required = false) String namespace) {
        return ResponseEntity.ok(workloadService.listPods(namespace));
    }

    /** GET /api/v1/kubernetes/pods/{namespace}/{podName} */
    @GetMapping("/pods/{namespace}/{podName}")
    public ResponseEntity<K8sPodDTO> getPodDetails(
            @PathVariable String namespace,
            @PathVariable String podName) {
        return ResponseEntity.ok(workloadService.getPodDetails(namespace, podName));
    }

    // ── F. Deployments ────────────────────────────────────────────────────────

    /** GET /api/v1/kubernetes/deployments?namespace=opspilot-demo */
    @GetMapping("/deployments")
    public ResponseEntity<List<K8sDeploymentDTO>> getDeployments(
            @RequestParam(required = false) String namespace) {
        return ResponseEntity.ok(workloadService.listDeployments(namespace));
    }

    // ── G. Services ───────────────────────────────────────────────────────────

    /** GET /api/v1/kubernetes/services?namespace=opspilot-demo */
    @GetMapping("/services")
    public ResponseEntity<List<K8sServiceDTO>> getServices(
            @RequestParam(required = false) String namespace) {
        return ResponseEntity.ok(workloadService.listServices(namespace));
    }

    // ── H. Pod Logs ───────────────────────────────────────────────────────────

    /**
     * GET /api/v1/kubernetes/pods/{namespace}/{podName}/logs
     *   ?container=backend&tailLines=200&previous=false
     */
    @GetMapping("/pods/{namespace}/{podName}/logs")
    public ResponseEntity<PodLogDTO> getPodLogs(
            @PathVariable String namespace,
            @PathVariable String podName,
            @RequestParam(required = false) String container,
            @RequestParam(required = false, defaultValue = "100") Integer tailLines,
            @RequestParam(required = false, defaultValue = "false") boolean previous) {
        return ResponseEntity.ok(logService.getPodLogs(namespace, podName, container, tailLines, previous));
    }

    // ── I. Events ─────────────────────────────────────────────────────────────

    /** GET /api/v1/kubernetes/events?namespace=opspilot-demo */
    @GetMapping("/events")
    public ResponseEntity<List<K8sEventDTO>> getEvents(
            @RequestParam(required = false) String namespace) {
        return ResponseEntity.ok(eventService.listEvents(namespace));
    }

    /** GET /api/v1/kubernetes/pods/{namespace}/{podName}/events */
    @GetMapping("/pods/{namespace}/{podName}/events")
    public ResponseEntity<List<K8sEventDTO>> getPodEvents(
            @PathVariable String namespace,
            @PathVariable String podName) {
        return ResponseEntity.ok(eventService.listPodEvents(namespace, podName));
    }
}
