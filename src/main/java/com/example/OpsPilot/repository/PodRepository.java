package com.example.OpsPilot.repository;

import com.example.OpsPilot.entity.Pod;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface PodRepository extends JpaRepository<Pod, String> {
    List<Pod> findByNamespace(String namespace);
}
