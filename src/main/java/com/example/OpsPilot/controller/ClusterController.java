package com.example.OpsPilot.controller;

import com.example.OpsPilot.dto.ActivityEventDTO;
import com.example.OpsPilot.dto.ClusterDTO;
import com.example.OpsPilot.dto.MetricDTO;
import com.example.OpsPilot.service.ClusterService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/cluster")
@RequiredArgsConstructor
public class ClusterController {

    private final ClusterService clusterService;

    /** GET /api/v1/cluster/overview?clusterKey=production-us-east */
    @GetMapping("/overview")
    public ResponseEntity<ClusterDTO.ClusterInfoDTO> getClusterOverview(
            @RequestParam(defaultValue = "production-us-east") String clusterKey
    ) {
        return ResponseEntity.ok(clusterService.getClusterOverview(clusterKey));
    }

    /** GET /api/v1/cluster/all */
    @GetMapping("/all")
    public ResponseEntity<List<ClusterDTO.ClusterSummaryDTO>> getAllClusters() {
        return ResponseEntity.ok(clusterService.getAllClusters());
    }

    /** GET /api/v1/cluster/nodes */
    @GetMapping("/nodes")
    public ResponseEntity<List<ClusterDTO.NodeDTO>> getNodes() {
        return ResponseEntity.ok(clusterService.getNodes());
    }

    /** GET /api/v1/cluster/metrics */
    @GetMapping("/metrics")
    public ResponseEntity<List<MetricDTO>> getMetrics() {
        return ResponseEntity.ok(clusterService.getResourceMetrics());
    }

    /** GET /api/v1/cluster/activities */
    @GetMapping("/activities")
    public ResponseEntity<List<ActivityEventDTO>> getActivities() {
        return ResponseEntity.ok(clusterService.getRecentActivities());
    }
}
