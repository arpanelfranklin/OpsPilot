package com.example.OpsPilot.dto;

import lombok.*;
import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class IncidentDTO {

    private String id;
    private Integer numericId;
    private String service;
    private String namespace;
    private String problem;
    private String severity;
    private String status;
    private String detectedAt;
    private String resolvedAt;
    private DiagnosisDTO diagnosis;
    private List<TimelineEventDTO> timeline;

    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class DiagnosisDTO {
        private String summary;
        private String rootCause;
        private String recommendedAction;
        private Integer confidence;
        private List<EvidenceDTO> evidence;
    }

    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class EvidenceDTO {
        private String label;
        private String value;
        private String type;
        private String detail;
    }

    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class TimelineEventDTO {
        private String id;
        private String time;
        private String title;
        private String description;
        private String type;
        private String author;
    }
}
