package com.example.OpsPilot.kubernetes.exception;

import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

import java.time.Instant;
import java.util.Map;

/**
 * Global exception handler for the Kubernetes REST endpoints.
 * Never exposes stack traces or credentials to the frontend.
 */
@RestControllerAdvice(basePackages = "com.example.OpsPilot.kubernetes")
@Slf4j
public class KubernetesExceptionHandler {

    @ExceptionHandler(KubernetesException.class)
    public ResponseEntity<Map<String, Object>> handleKubernetesException(KubernetesException ex) {
        log.warn("Kubernetes API error: {}", ex.getMessage());
        int status = ex.getHttpStatus();
        return ResponseEntity.status(status).body(errorBody(ex.getMessage(), status));
    }

    @ExceptionHandler(IllegalArgumentException.class)
    public ResponseEntity<Map<String, Object>> handleBadRequest(IllegalArgumentException ex) {
        log.warn("Invalid Kubernetes request: {}", ex.getMessage());
        return ResponseEntity.badRequest().body(errorBody(ex.getMessage(), 400));
    }

    @ExceptionHandler(Exception.class)
    public ResponseEntity<Map<String, Object>> handleGeneric(Exception ex) {
        log.error("Unexpected error in Kubernetes controller", ex);
        return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body(errorBody("An unexpected error occurred", 500));
    }

    private Map<String, Object> errorBody(String message, int status) {
        return Map.of(
                "error", message,
                "status", status,
                "timestamp", Instant.now().toString()
        );
    }
}
