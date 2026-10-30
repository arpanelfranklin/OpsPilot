package com.example.OpsPilot.service;

import com.example.OpsPilot.entity.*;
import com.example.OpsPilot.enums.Severity;
import com.example.OpsPilot.repository.*;
import com.fasterxml.jackson.databind.ObjectMapper;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

import java.util.List;
import java.util.Map;

/**
 * Seeds the database with the same data that was previously in the frontend mock files.
 * Only runs if the tables are empty to avoid re-inserting on restart.
 */
@Component
@RequiredArgsConstructor
@Slf4j
public class DataSeederService implements CommandLineRunner {

    private final IncidentRepository incidentRepository;
    private final DeploymentRepository deploymentRepository;
    private final PodRepository podRepository;
    private final K8sServiceRepository k8sServiceRepository;
    private final ClusterInfoRepository clusterInfoRepository;
    private final NodeRepository nodeRepository;
    private final MetricRepository metricRepository;
    private final ActivityEventRepository activityEventRepository;
    private final ObjectMapper objectMapper;

    @Override
    public void run(String... args) throws Exception {
        seedIncidents();
        seedDeployments();
        seedPods();
        seedK8sServices();
        seedClusterInfos();
        seedNodes();
        seedMetrics();
        seedActivities();
        log.info("✅ OpsPilot data seeding complete.");
    }

    // ------------------------------------------------------------------ INCIDENTS

    private void seedIncidents() throws Exception {
        if (incidentRepository.count() > 0) return;

        // INC-102
        incidentRepository.save(Incident.builder()
                .incidentKey("INC-102").numericId(102)
                .service("chat-backend").namespace("chat-app")
                .problem("CrashLoopBackOff").severity(Severity.HIGH)
                .status("Investigating").detectedAt("10:42")
                .diagnosisSummary("Backend pods are repeatedly restarting. The latest container termination reason is OOMKilled.")
                .rootCause("Container process memory footprint exceeded the hard limit of 512Mi under burst WebSocket traffic.")
                .recommendedAction("Increase memory limit to 1024Mi and profile active heap allocations in connection handler.")
                .confidence(94)
                .evidenceJson(objectMapper.writeValueAsString(List.of(
                        Map.of("label", "Restarts", "value", "7 times in last 15m", "type", "metric", "detail", "Exit code 137 (SIGKILL)"),
                        Map.of("label", "Memory usage", "value", "98% (502Mi / 512Mi)", "type", "metric", "detail", "Spike recorded at 10:41:45 UTC"),
                        Map.of("label", "Memory limit", "value", "512Mi (ResourceQuota: strict)", "type", "config", "detail", "cgroups v2 limit enforced"),
                        Map.of("label", "Last termination", "value", "OOMKilled", "type", "event", "detail", "Kubelet kernel invoked oom_kill_process")
                )))
                .timelineJson(objectMapper.writeValueAsString(List.of(
                        Map.of("id", "t1", "time", "10:42", "title", "Incident detected", "description", "Pod chat-backend-7c9b846-9xk2p entered CrashLoopBackOff", "type", "detection"),
                        Map.of("id", "t2", "time", "10:43", "title", "Kubernetes logs collected", "description", "Pulled 1500 lines of previous container logs and dmesg outputs", "type", "log_collected"),
                        Map.of("id", "t3", "time", "10:44", "title", "AI diagnosis generated", "description", "Correlation engine flagged memory threshold breach and SIGKILL exit", "type", "diagnosis"),
                        Map.of("id", "t4", "time", "10:45", "title", "Remediation recommended", "description", "Suggested updating resources.limits.memory to 1024Mi", "type", "recommendation"),
                        Map.of("id", "t5", "time", "10:45", "title", "Remediation awaiting approval", "description", "SRE intervention required before deployment patch roll-out", "type", "approval")
                )))
                .build());

        // INC-101
        incidentRepository.save(Incident.builder()
                .incidentKey("INC-101").numericId(101)
                .service("chat-backend").namespace("chat-app")
                .problem("High memory usage").severity(Severity.MEDIUM)
                .status("Resolved").detectedAt("08:21").resolvedAt("08:54")
                .diagnosisSummary("Pod memory usage crossed 85% warning threshold following bulk socket connection reconnects.")
                .rootCause("Garbage collector lag during transient connection surge.")
                .recommendedAction("Enabled V8 aggressive memory release flags and auto-cleared socket session buffers.")
                .confidence(88)
                .evidenceJson(objectMapper.writeValueAsString(List.of(
                        Map.of("label", "Peak Memory", "value", "445Mi / 512Mi (87%)", "type", "metric"),
                        Map.of("label", "Connection Surge", "value", "+4,200 socket conns in 3m", "type", "event"),
                        Map.of("label", "GC Pause", "value", "180ms latency spike", "type", "metric")
                )))
                .timelineJson(objectMapper.writeValueAsString(List.of(
                        Map.of("id", "t101-1", "time", "08:21", "title", "High memory alert triggered", "description", "Prometheus alert: PodMemorySaturationWarning", "type", "detection"),
                        Map.of("id", "t101-2", "time", "08:25", "title", "AI Analysis initiated", "description", "Evaluated heap dumps and inbound socket rates", "type", "diagnosis"),
                        Map.of("id", "t101-3", "time", "08:35", "title", "Memory stabilized", "description", "Traffic leveled off; memory settled at 58%", "type", "action"),
                        Map.of("id", "t101-4", "time", "08:54", "title", "Incident resolved", "description", "Alert cleared automatically", "type", "action")
                )))
                .build());

        // INC-099
        incidentRepository.save(Incident.builder()
                .incidentKey("INC-099").numericId(99)
                .service("auth-service").namespace("security")
                .problem("Readiness Probe Failed").severity(Severity.LOW)
                .status("Resolved").detectedAt("Yesterday 19:15").resolvedAt("Yesterday 19:22")
                .diagnosisSummary("Readiness probe timed out due to transient PostgreSQL connection pool saturation.")
                .rootCause("DB pool exhausted for 4 seconds during scheduled maintenance batch.")
                .recommendedAction("Increased connection pool max size to 50.")
                .confidence(96)
                .evidenceJson(objectMapper.writeValueAsString(List.of(
                        Map.of("label", "Probe Failure", "value", "HTTP 503 on /health/ready", "type", "event"),
                        Map.of("label", "DB Pool Queue", "value", "25 waiting threads", "type", "metric")
                )))
                .timelineJson(objectMapper.writeValueAsString(List.of(
                        Map.of("id", "t99-1", "time", "19:15", "title", "Probe failure alert", "description", "Readiness probe failed 3 consecutive checks", "type", "detection"),
                        Map.of("id", "t99-2", "time", "19:22", "title", "Traffic re-routed & resolved", "description", "Replica caught up and resumed accepting traffic", "type", "action")
                )))
                .build());

        log.info("Seeded 3 incidents.");
    }

    // ------------------------------------------------------------------ DEPLOYMENTS

    private void seedDeployments() throws Exception {
        if (deploymentRepository.count() > 0) return;

        deploymentRepository.saveAll(List.of(
                Deployment.builder()
                        .id("dep-1").name("chat-backend").namespace("chat-app")
                        .desiredReplicas(2).readyReplicas(1).status("Degraded")
                        .image("ghcr.io/opspilot/chat-backend").version("v1.2.4")
                        .restarts(7).cpuRequest("250m").cpuLimit("1000m")
                        .memoryRequest("256Mi").memoryLimit("512Mi")
                        .createdAt("3 days ago").strategy("RollingUpdate (maxSurge: 25%, maxUnavailable: 25%)")
                        .eventsJson(objectMapper.writeValueAsString(List.of(
                                Map.of("id", "ev-1", "type", "Warning", "reason", "BackOff",
                                        "message", "Back-off restarting failed container chat-backend in pod chat-backend-7c9b846-9xk2p", "timestamp", "10:43:02", "count", 7),
                                Map.of("id", "ev-2", "type", "Warning", "reason", "Unhealthy",
                                        "message", "Liveness probe failed: HTTP probe failed with statuscode: 500", "timestamp", "10:41:50", "count", 3),
                                Map.of("id", "ev-3", "type", "Normal", "reason", "ScalingReplicaSet",
                                        "message", "Scaled up replica set chat-backend-7c9b846 to 2", "timestamp", "3 days ago", "count", 1)
                        ))).build(),
                Deployment.builder()
                        .id("dep-2").name("chat-frontend").namespace("chat-app")
                        .desiredReplicas(2).readyReplicas(2).status("Healthy")
                        .image("ghcr.io/opspilot/chat-frontend").version("v1.2.4")
                        .restarts(0).cpuRequest("100m").cpuLimit("500m")
                        .memoryRequest("128Mi").memoryLimit("256Mi")
                        .createdAt("3 days ago").strategy("RollingUpdate")
                        .eventsJson(objectMapper.writeValueAsString(List.of(
                                Map.of("id", "ev-4", "type", "Normal", "reason", "Started",
                                        "message", "Started container nginx-web", "timestamp", "3 days ago", "count", 1)
                        ))).build(),
                Deployment.builder()
                        .id("dep-3").name("mongodb").namespace("chat-app")
                        .desiredReplicas(1).readyReplicas(1).status("Healthy")
                        .image("mongo").version("v6.0.14")
                        .restarts(0).cpuRequest("500m").cpuLimit("2000m")
                        .memoryRequest("1Gi").memoryLimit("2Gi")
                        .createdAt("12 days ago").strategy("Recreate")
                        .eventsJson(objectMapper.writeValueAsString(List.of(
                                Map.of("id", "ev-5", "type", "Normal", "reason", "SuccessfulCreate",
                                        "message", "Created pod: mongodb-68b6ff9bc5-4hlnm", "timestamp", "12 days ago", "count", 1)
                        ))).build(),
                Deployment.builder()
                        .id("dep-4").name("auth-service").namespace("security")
                        .desiredReplicas(2).readyReplicas(2).status("Healthy")
                        .image("ghcr.io/opspilot/auth-service").version("v2.0.1")
                        .restarts(1).cpuRequest("200m").cpuLimit("800m")
                        .memoryRequest("256Mi").memoryLimit("512Mi")
                        .createdAt("5 days ago").strategy("RollingUpdate")
                        .eventsJson(objectMapper.writeValueAsString(List.of(
                                Map.of("id", "ev-6", "type", "Normal", "reason", "Pulled",
                                        "message", "Container image already present on machine", "timestamp", "5 days ago", "count", 2)
                        ))).build(),
                Deployment.builder()
                        .id("dep-5").name("prometheus-k8s").namespace("monitoring")
                        .desiredReplicas(1).readyReplicas(1).status("Healthy")
                        .image("quay.io/prometheus/prometheus").version("v2.50.1")
                        .restarts(0).cpuRequest("500m").cpuLimit("2000m")
                        .memoryRequest("2Gi").memoryLimit("4Gi")
                        .createdAt("28 days ago").strategy("Recreate")
                        .eventsJson("[]").build()
        ));

        log.info("Seeded 5 deployments.");
    }

    // ------------------------------------------------------------------ PODS

    private void seedPods() throws Exception {
        if (podRepository.count() > 0) return;

        podRepository.saveAll(List.of(
                Pod.builder().id("pod-1").name("chat-backend-7c9b846-9xk2p").namespace("chat-app")
                        .node("node-02").status("CrashLoopBackOff").readyContainers("0/1")
                        .restarts(7).cpu("18m").memory("502Mi (OOM)").ip("10.244.1.42").age("42m")
                        .eventsJson(objectMapper.writeValueAsString(List.of(
                                Map.of("id", "p-ev-1", "type", "Warning", "reason", "BackOff",
                                        "message", "Back-off 5m0s restarting failed container=chat-backend pod=chat-backend-7c9b846-9xk2p_chat-app", "timestamp", "10:43:02", "count", 7),
                                Map.of("id", "p-ev-2", "type", "Warning", "reason", "OOMKilled",
                                        "message", "Container chat-backend was killed due to memory limit breach (512Mi)", "timestamp", "10:41:45", "count", 1)
                        ))).build(),
                Pod.builder().id("pod-2").name("chat-backend-7c9b846-t5wmq").namespace("chat-app")
                        .node("node-01").status("Running").readyContainers("1/1")
                        .restarts(0).cpu("120m").memory("310Mi").ip("10.244.0.88").age("3d")
                        .eventsJson("[]").build(),
                Pod.builder().id("pod-3").name("chat-frontend-55f69c-29qzb").namespace("chat-app")
                        .node("node-01").status("Running").readyContainers("1/1")
                        .restarts(0).cpu("15m").memory("45Mi").ip("10.244.0.89").age("3d")
                        .eventsJson("[]").build(),
                Pod.builder().id("pod-4").name("chat-frontend-55f69c-88mkl").namespace("chat-app")
                        .node("node-03").status("Running").readyContainers("1/1")
                        .restarts(0).cpu("18m").memory("48Mi").ip("10.244.2.14").age("3d")
                        .eventsJson("[]").build(),
                Pod.builder().id("pod-5").name("mongodb-68b6ff9bc5-4hlnm").namespace("chat-app")
                        .node("node-03").status("Running").readyContainers("1/1")
                        .restarts(0).cpu("85m").memory("780Mi").ip("10.244.2.19").age("12d")
                        .eventsJson("[]").build(),
                Pod.builder().id("pod-6").name("auth-service-7f44d8-j8zlc").namespace("security")
                        .node("node-02").status("Running").readyContainers("1/1")
                        .restarts(1).cpu("40m").memory("190Mi").ip("10.244.1.75").age("5d")
                        .eventsJson("[]").build()
        ));

        log.info("Seeded 6 pods.");
    }

    // ------------------------------------------------------------------ K8S SERVICES

    private void seedK8sServices() throws Exception {
        if (k8sServiceRepository.count() > 0) return;

        k8sServiceRepository.saveAll(List.of(
                K8sService.builder().id("svc-1").name("chat-backend-svc").namespace("chat-app")
                        .type("ClusterIP").clusterIP("10.96.142.88").endpointsCount(1).age("3d")
                        .portsJson(objectMapper.writeValueAsString(List.of(
                                Map.of("name", "http", "protocol", "TCP", "port", 8080, "targetPort", 8080))))
                        .selectorJson(objectMapper.writeValueAsString(Map.of("app", "chat-backend"))).build(),
                K8sService.builder().id("svc-2").name("chat-frontend-svc").namespace("chat-app")
                        .type("LoadBalancer").clusterIP("10.96.200.15").externalIP("34.120.45.89")
                        .endpointsCount(2).age("3d")
                        .portsJson(objectMapper.writeValueAsString(List.of(
                                Map.of("name", "http", "protocol", "TCP", "port", 80, "targetPort", 80))))
                        .selectorJson(objectMapper.writeValueAsString(Map.of("app", "chat-frontend"))).build(),
                K8sService.builder().id("svc-3").name("mongodb-svc").namespace("chat-app")
                        .type("ClusterIP").clusterIP("10.96.88.2").endpointsCount(1).age("12d")
                        .portsJson(objectMapper.writeValueAsString(List.of(
                                Map.of("name", "mongodb", "protocol", "TCP", "port", 27017, "targetPort", 27017))))
                        .selectorJson(objectMapper.writeValueAsString(Map.of("app", "mongodb"))).build(),
                K8sService.builder().id("svc-4").name("auth-service-svc").namespace("security")
                        .type("ClusterIP").clusterIP("10.96.44.19").endpointsCount(2).age("5d")
                        .portsJson(objectMapper.writeValueAsString(List.of(
                                Map.of("name", "http", "protocol", "TCP", "port", 9000, "targetPort", 9000))))
                        .selectorJson(objectMapper.writeValueAsString(Map.of("app", "auth-service"))).build()
        ));

        log.info("Seeded 4 K8s services.");
    }

    // ------------------------------------------------------------------ CLUSTER INFOS

    private void seedClusterInfos() {
        if (clusterInfoRepository.count() > 0) return;

        clusterInfoRepository.saveAll(List.of(
                ClusterInfo.builder().id("k8s-prod-us-east-1").clusterKey("production-us-east")
                        .name("prod-cluster-alpha").environment("Production").status("Degraded")
                        .k8sVersion("v1.29.2-gke.1400").namespacesCount(6).nodeCount(3)
                        .podsRunning(11).podsTotal(12).cpuUsagePercent(42).memoryUsagePercent(61)
                        .networkThroughput("1.4 Gbps").uptime("99.98% (28d 14h)").build(),
                ClusterInfo.builder().id("k8s-stage-us-east-1").clusterKey("staging-us-east")
                        .name("staging-cluster-beta").environment("Staging").status("Healthy")
                        .k8sVersion("v1.29.2").namespacesCount(4).nodeCount(2)
                        .podsRunning(8).podsTotal(8).cpuUsagePercent(28).memoryUsagePercent(45)
                        .networkThroughput("480 Mbps").uptime("99.99% (14d 6h)").build(),
                ClusterInfo.builder().id("k8s-dev-cluster").clusterKey("dev-local")
                        .name("dev-cluster-local").environment("Development").status("Healthy")
                        .k8sVersion("v1.30.0-kind").namespacesCount(3).nodeCount(1)
                        .podsRunning(5).podsTotal(5).cpuUsagePercent(18).memoryUsagePercent(32)
                        .networkThroughput("120 Mbps").uptime("100% (2d 18h)").build()
        ));

        log.info("Seeded 3 cluster infos.");
    }

    // ------------------------------------------------------------------ NODES

    private void seedNodes() throws Exception {
        if (nodeRepository.count() > 0) return;

        nodeRepository.saveAll(List.of(
                Node.builder().id("node-01").name("node-01.us-east.compute.internal")
                        .status("Ready").rolesJson(objectMapper.writeValueAsString(List.of("control-plane", "worker")))
                        .cpuUsagePercent(34).cpuCores(8).memoryUsagePercent(51).memoryCapacityGiB(32)
                        .podCount(8).podCapacity(30).kubeletVersion("v1.29.2").ipAddress("10.240.0.12").zone("us-east-1a").build(),
                Node.builder().id("node-02").name("node-02.us-east.compute.internal")
                        .status("Ready").rolesJson(objectMapper.writeValueAsString(List.of("worker")))
                        .cpuUsagePercent(48).cpuCores(8).memoryUsagePercent(63).memoryCapacityGiB(32)
                        .podCount(7).podCapacity(30).kubeletVersion("v1.29.2").ipAddress("10.240.0.13").zone("us-east-1b").build(),
                Node.builder().id("node-03").name("node-03.us-east.compute.internal")
                        .status("Ready").rolesJson(objectMapper.writeValueAsString(List.of("worker")))
                        .cpuUsagePercent(45).cpuCores(8).memoryUsagePercent(69).memoryCapacityGiB(32)
                        .podCount(6).podCapacity(30).kubeletVersion("v1.29.2").ipAddress("10.240.0.14").zone("us-east-1c").build()
        ));

        log.info("Seeded 3 nodes.");
    }

    // ------------------------------------------------------------------ METRICS

    private void seedMetrics() {
        if (metricRepository.count() > 0) return;

        metricRepository.saveAll(List.of(
                MetricDataPoint.builder().timestamp("10:15").time("10:15").cpu(32).memory(54).network(120).build(),
                MetricDataPoint.builder().timestamp("10:20").time("10:20").cpu(35).memory(55).network(140).build(),
                MetricDataPoint.builder().timestamp("10:25").time("10:25").cpu(34).memory(56).network(135).build(),
                MetricDataPoint.builder().timestamp("10:30").time("10:30").cpu(38).memory(58).network(180).build(),
                MetricDataPoint.builder().timestamp("10:35").time("10:35").cpu(45).memory(64).network(290).build(),
                MetricDataPoint.builder().timestamp("10:40").time("10:40").cpu(58).memory(78).network(410).build(),
                MetricDataPoint.builder().timestamp("10:41").time("10:41").cpu(67).memory(92).network(550).build(),
                MetricDataPoint.builder().timestamp("10:42").time("10:42").cpu(44).memory(98).network(480).build(),
                MetricDataPoint.builder().timestamp("10:45").time("10:45").cpu(42).memory(61).network(320).build(),
                MetricDataPoint.builder().timestamp("10:50").time("10:50").cpu(40).memory(60).network(280).build(),
                MetricDataPoint.builder().timestamp("10:55").time("10:55").cpu(42).memory(61).network(310).build()
        ));

        log.info("Seeded 11 metric data points.");
    }

    // ------------------------------------------------------------------ ACTIVITIES

    private void seedActivities() {
        if (activityEventRepository.count() > 0) return;

        activityEventRepository.saveAll(List.of(
                ActivityEvent.builder().id("act-1").time("10:45").title("Remediation awaiting approval")
                        .description("AI proposed memory limit increase for chat-backend").type("ai").severity("warning").build(),
                ActivityEvent.builder().id("act-2").time("10:44").title("Diagnosis generated")
                        .description("Root cause identified: OOMKilled on container termination").type("ai").severity("info").build(),
                ActivityEvent.builder().id("act-3").time("10:43").title("Kubernetes logs collected")
                        .description("1500 log lines retrieved from namespace chat-app").type("k8s").severity("info").build(),
                ActivityEvent.builder().id("act-4").time("10:42").title("AI detected CrashLoopBackOff")
                        .description("chat-backend pod restarted with exit code 137").type("incident").severity("critical").build(),
                ActivityEvent.builder().id("act-5").time("08:54").title("Incident INC-101 resolved")
                        .description("Memory usage normalized on chat-backend").type("incident").severity("info").build()
        ));

        log.info("Seeded 5 activity events.");
    }
}
