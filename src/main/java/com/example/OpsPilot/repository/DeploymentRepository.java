package com.example.OpsPilot.repository;

import com.example.OpsPilot.entity.Deployment;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface DeploymentRepository extends JpaRepository<Deployment, String> {
    List<Deployment> findByNamespace(String namespace);
}
