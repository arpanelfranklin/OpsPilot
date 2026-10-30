package com.example.OpsPilot.repository;

import com.example.OpsPilot.entity.ClusterInfo;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.Optional;

public interface ClusterInfoRepository extends JpaRepository<ClusterInfo, String> {
    Optional<ClusterInfo> findByClusterKey(String clusterKey);
}
