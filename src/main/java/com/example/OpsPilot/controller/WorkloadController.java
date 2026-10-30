package com.example.OpsPilot.controller;

import com.example.OpsPilot.dto.WorkloadDTO;
import com.example.OpsPilot.service.WorkloadService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/workloads")
@RequiredArgsConstructor
public class WorkloadController {

    private final WorkloadService workloadService;

    /** GET /api/v1/workloads/deployments?namespace=chat-app */
    @GetMapping("/deployments")
    public ResponseEntity<List<WorkloadDTO.DeploymentDTO>> getDeployments(
            @RequestParam(required = false) String namespace
    ) {
        return ResponseEntity.ok(workloadService.getDeployments(namespace));
    }

    /** GET /api/v1/workloads/pods?namespace=chat-app */
    @GetMapping("/pods")
    public ResponseEntity<List<WorkloadDTO.PodDTO>> getPods(
            @RequestParam(required = false) String namespace
    ) {
        return ResponseEntity.ok(workloadService.getPods(namespace));
    }

    /** GET /api/v1/workloads/services?namespace=chat-app */
    @GetMapping("/services")
    public ResponseEntity<List<WorkloadDTO.ServiceDTO>> getServices(
            @RequestParam(required = false) String namespace
    ) {
        return ResponseEntity.ok(workloadService.getServices(namespace));
    }

    /** GET /api/v1/workloads/summary */
    @GetMapping("/summary")
    public ResponseEntity<WorkloadDTO.WorkloadSummaryDTO> getSummary() {
        return ResponseEntity.ok(workloadService.getWorkloadSummary());
    }
}
