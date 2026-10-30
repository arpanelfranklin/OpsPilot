package com.example.OpsPilot.entity;

import com.example.OpsPilot.enums.Severity;
import jakarta.persistence.*;
import lombok.*;

import java.util.List;

@Entity
@Table(name = "incidents")
@Builder
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Incident {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String incidentKey;   // e.g. "INC-102"
    private Integer numericId;

    private String service;
    private String namespace;
    private String problem;

    @Enumerated(EnumType.STRING)
    private Severity severity;

    private String status;        // Investigating | Resolved | Mitigated | Awaiting Approval
    private String detectedAt;
    private String resolvedAt;

    // ---- Diagnosis (embedded) ----
    @Column(columnDefinition = "TEXT")
    private String diagnosisSummary;
    @Column(columnDefinition = "TEXT")
    private String rootCause;
    @Column(columnDefinition = "TEXT")
    private String recommendedAction;
    private Integer confidence;

    // JSON-stored nested collections
    @Column(columnDefinition = "TEXT")
    private String evidenceJson;      // serialised List<IncidentEvidence>

    @Column(columnDefinition = "TEXT")
    private String timelineJson;      // serialised List<IncidentTimelineEvent>
}
