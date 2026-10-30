package com.example.OpsPilot.repository;

import com.example.OpsPilot.entity.K8sService;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface K8sServiceRepository extends JpaRepository<K8sService, String> {
    List<K8sService> findByNamespace(String namespace);
}
