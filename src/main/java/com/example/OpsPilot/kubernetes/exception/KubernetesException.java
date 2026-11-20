package com.example.OpsPilot.kubernetes.exception;

import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.ResponseStatus;

/**
 * Wraps Kubernetes API errors with a meaningful HTTP status.
 */
@ResponseStatus(HttpStatus.SERVICE_UNAVAILABLE)
public class KubernetesException extends RuntimeException {

    private final int httpStatus;

    public KubernetesException(String message, int httpStatus) {
        super(message);
        this.httpStatus = httpStatus;
    }

    public KubernetesException(String message, Throwable cause) {
        super(message, cause);
        this.httpStatus = 503;
    }

    public KubernetesException(String message, int httpStatus, Throwable cause) {
        super(message, cause);
        this.httpStatus = httpStatus;
    }

    public int getHttpStatus() {
        return httpStatus;
    }
}
