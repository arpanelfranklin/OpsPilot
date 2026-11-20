package com.example.OpsPilot.kubernetes.config;

import io.kubernetes.client.openapi.ApiClient;
import io.kubernetes.client.util.ClientBuilder;
import io.kubernetes.client.util.KubeConfig;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import java.io.FileReader;
import java.io.IOException;
import java.nio.file.Path;
import java.nio.file.Paths;

/**
 * Kubernetes API client configuration.
 *
 * Supports two modes controlled by {@code kubernetes.mode} property:
 *   - local      : loads ~/.kube/config and uses current context (dev/kind)
 *   - in-cluster : uses ServiceAccount token injected by Kubernetes (production)
 */
@Configuration
@Slf4j
public class KubernetesConfig {

    @Value("${kubernetes.mode:local}")
    private String kubernetesMode;

    @Value("${kubernetes.kubeconfig.path:}")
    private String kubeconfigPath;

    @Bean
    public ApiClient apiClient() throws IOException {
        if ("in-cluster".equalsIgnoreCase(kubernetesMode)) {
            return buildInClusterClient();
        }
        return buildLocalClient();
    }

    private ApiClient buildLocalClient() throws IOException {
        Path kubeConfigPath = resolveKubeconfigPath();
        log.info("Kubernetes mode: local — loading kubeconfig from {}", kubeConfigPath);
        try {
            ApiClient client = ClientBuilder
                    .kubeconfig(KubeConfig.loadKubeConfig(new FileReader(kubeConfigPath.toFile())))
                    .build();
            io.kubernetes.client.openapi.Configuration.setDefaultApiClient(client);
            log.info("Kubernetes local client initialised successfully");
            return client;
        } catch (IOException e) {
            log.warn("Could not load kubeconfig from {}. Kubernetes features will be unavailable: {}",
                    kubeConfigPath, e.getMessage());
            // Return a no-op client so the application starts — connection checks will report failure
            ApiClient client = ClientBuilder.standard().build();
            io.kubernetes.client.openapi.Configuration.setDefaultApiClient(client);
            return client;
        }
    }

    private ApiClient buildInClusterClient() throws IOException {
        log.info("Kubernetes mode: in-cluster — using ServiceAccount credentials");
        ApiClient client = ClientBuilder.cluster().build();
        io.kubernetes.client.openapi.Configuration.setDefaultApiClient(client);
        log.info("Kubernetes in-cluster client initialised successfully");
        return client;
    }

    private Path resolveKubeconfigPath() {
        if (kubeconfigPath != null && !kubeconfigPath.isBlank()) {
            return Paths.get(kubeconfigPath);
        }
        // Default: $HOME/.kube/config
        return Paths.get(System.getProperty("user.home"), ".kube", "config");
    }
}
