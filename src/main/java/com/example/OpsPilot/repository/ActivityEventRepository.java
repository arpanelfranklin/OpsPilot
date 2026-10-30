package com.example.OpsPilot.repository;

import com.example.OpsPilot.entity.ActivityEvent;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ActivityEventRepository extends JpaRepository<ActivityEvent, String> {
}
