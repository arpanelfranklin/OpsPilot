package com.example.OpsPilot.controller;

import com.example.OpsPilot.dto.IncidentDTO;
import com.example.OpsPilot.service.IncidentService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/v1")
@RequiredArgsConstructor
public class IncidentController {

    private final IncidentService incidentService;

    /** GET /api/v1/incidents?severity=HIGH&status=Investigating&service=chat */
    @GetMapping("/incidents")
    public ResponseEntity<List<IncidentDTO>> getIncidents(
            @RequestParam(required = false) String severity,
            @RequestParam(required = false) String status,
            @RequestParam(required = false) String service
    ) {
        return ResponseEntity.ok(incidentService.getAllIncidentDTOs(severity, status, service));
    }

    /** GET /api/v1/incidents/INC-102  or  /api/v1/incidents/102 */
    @GetMapping("/incidents/{key}")
    public ResponseEntity<IncidentDTO> getIncident(@PathVariable String key) {
        return incidentService.getIncidentDTOByKey(key)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    /** POST /api/v1/incidents/{key}/actions  (remediation trigger) */
    @PostMapping("/incidents/{key}/actions")
    public ResponseEntity<Map<String, Object>> triggerAction(
            @PathVariable String key,
            @RequestBody Map<String, String> body
    ) {
        String action = body.getOrDefault("action", "unknown");
        return ResponseEntity.ok(Map.of(
                "success", true,
                "incidentKey", key,
                "action", action,
                "message", "Action [" + action + "] queued for incident " + key,
                "timestamp", java.time.LocalTime.now().toString()
        ));
    }

    /** Health check endpoint */
    @GetMapping("/health")
    public ResponseEntity<Map<String, String>> health() {
        return ResponseEntity.ok(Map.of("status", "UP", "service", "opspilot-backend"));
    }
}
