package com.example.OpsPilot.service;

import com.example.OpsPilot.dto.IncidentDTO;
import com.example.OpsPilot.entity.Incident;
import com.example.OpsPilot.repository.IncidentRepository;
import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class IncidentService {

    private final IncidentRepository incidentRepository;
    private final ObjectMapper objectMapper;

    public void addIncident(Incident incident) {
        incidentRepository.save(incident);
    }

    public List<Incident> getIncidents() {
        return incidentRepository.findAll();
    }

    public Incident getIncidentById(Long id) {
        return incidentRepository.getReferenceById(id);
    }

    // ---- Rich DTO methods for frontend ----

    public List<IncidentDTO> getAllIncidentDTOs(String severity, String status, String service) {
        return incidentRepository.findAll().stream()
                .filter(i -> severity == null || severity.equals("ALL") || severity.equalsIgnoreCase(i.getSeverity().name()))
                .filter(i -> status == null || status.equals("ALL") || status.equalsIgnoreCase(i.getStatus()))
                .filter(i -> service == null || service.equals("ALL") || (i.getService() != null && i.getService().toLowerCase().contains(service.toLowerCase())))
                .map(this::toDTO)
                .collect(Collectors.toList());
    }

    public Optional<IncidentDTO> getIncidentDTOByKey(String key) {
        return incidentRepository.findAll().stream()
                .filter(i -> key.equalsIgnoreCase(i.getIncidentKey())
                        || key.equalsIgnoreCase("INC-" + i.getNumericId())
                        || key.equals(String.valueOf(i.getNumericId())))
                .map(this::toDTO)
                .findFirst();
    }

    private IncidentDTO toDTO(Incident incident) {
        List<IncidentDTO.EvidenceDTO> evidence = parseJson(incident.getEvidenceJson(),
                new TypeReference<List<IncidentDTO.EvidenceDTO>>() {});
        List<IncidentDTO.TimelineEventDTO> timeline = parseJson(incident.getTimelineJson(),
                new TypeReference<List<IncidentDTO.TimelineEventDTO>>() {});

        IncidentDTO.DiagnosisDTO diagnosis = IncidentDTO.DiagnosisDTO.builder()
                .summary(incident.getDiagnosisSummary())
                .rootCause(incident.getRootCause())
                .recommendedAction(incident.getRecommendedAction())
                .confidence(incident.getConfidence())
                .evidence(evidence)
                .build();

        return IncidentDTO.builder()
                .id(incident.getIncidentKey())
                .numericId(incident.getNumericId())
                .service(incident.getService())
                .namespace(incident.getNamespace())
                .problem(incident.getProblem())
                .severity(incident.getSeverity() != null ? incident.getSeverity().name() : null)
                .status(incident.getStatus())
                .detectedAt(incident.getDetectedAt())
                .resolvedAt(incident.getResolvedAt())
                .diagnosis(diagnosis)
                .timeline(timeline)
                .build();
    }

    private <T> T parseJson(String json, TypeReference<T> type) {
        if (json == null || json.isBlank()) return null;
        try {
            return objectMapper.readValue(json, type);
        } catch (Exception e) {
            return null;
        }
    }
}
