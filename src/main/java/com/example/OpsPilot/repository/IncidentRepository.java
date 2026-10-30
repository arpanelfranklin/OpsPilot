package com.example.OpsPilot.repository;

import com.example.OpsPilot.entity.Incident;
import org.springframework.data.jpa.repository.JpaRepository;

public interface IncidentRepository extends JpaRepository<Incident, Long> {
}
