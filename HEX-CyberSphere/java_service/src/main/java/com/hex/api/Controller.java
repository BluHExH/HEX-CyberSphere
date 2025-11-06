package com.hex.api;

import org.springframework.web.bind.annotation.*;
import org.springframework.http.ResponseEntity;
import org.springframework.http.HttpStatus;

import java.util.HashMap;
import java.util.Map;
import java.util.concurrent.CompletableFuture;

@RestController
@RequestMapping("/api")
public class Controller {
    
    // Health check endpoint
    @GetMapping("/health")
    public ResponseEntity<Map<String, Object>> healthCheck() {
        Map<String, Object> response = new HashMap<>();
        response.put("status", "healthy");
        response.put("service", "Java REST API");
        response.put("timestamp", System.currentTimeMillis());
        return ResponseEntity.ok(response);
    }
    
    // System status endpoint
    @GetMapping("/status")
    public ResponseEntity<Map<String, Object>> getStatus() {
        Map<String, Object> response = new HashMap<>();
        response.put("system", "HEX-CyberSphere");
        response.put("version", "1.0.0");
        response.put("java_version", System.getProperty("java.version"));
        response.put("uptime", System.currentTimeMillis());
        
        // Add service status
        Map<String, String> services = new HashMap<>();
        services.put("api_service", "running");
        services.put("task_executor", "ready");
        services.put("database", "connected");
        response.put("services", services);
        
        return ResponseEntity.ok(response);
    }
    
    // Task execution endpoint
    @PostMapping("/tasks/execute")
    public ResponseEntity<Map<String, Object>> executeTask(@RequestBody Map<String, Object> taskRequest) {
        Map<String, Object> response = new HashMap<>();
        
        try {
            String taskName = (String) taskRequest.get("task_name");
            Map<String, Object> taskParams = (Map<String, Object>) taskRequest.get("params");
            
            // Execute task asynchronously
            CompletableFuture<Map<String, Object>> taskFuture = 
                CompletableFuture.supplyAsync(() -> TaskExecutor.execute(taskName, taskParams));
            
            Map<String, Object> result = taskFuture.get();
            
            response.put("status", "success");
            response.put("task_name", taskName);
            response.put("result", result);
            response.put("timestamp", System.currentTimeMillis());
            
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            response.put("status", "error");
            response.put("message", "Task execution failed: " + e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(response);
        }
    }
    
    // Task history endpoint
    @GetMapping("/tasks/history")
    public ResponseEntity<Map<String, Object>> getTaskHistory() {
        Map<String, Object> response = new HashMap<>();
        
        try {
            // Simulate getting task history
            response.put("status", "success");
            response.put("history", TaskExecutor.getTaskHistory());
            response.put("count", TaskExecutor.getTaskHistory().size());
            
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            response.put("status", "error");
            response.put("message", "Failed to retrieve task history: " + e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(response);
        }
    }
    
    // Security scan endpoint
    @PostMapping("/security/scan")
    public ResponseEntity<Map<String, Object>> securityScan(@RequestBody Map<String, Object> scanRequest) {
        Map<String, Object> response = new HashMap<>();
        
        try {
            String target = (String) scanRequest.get("target");
            String scanType = (String) scanRequest.get("scan_type");
            
            // Execute security scan
            Map<String, Object> scanResult = TaskExecutor.executeSecurityScan(target, scanType);
            
            response.put("status", "success");
            response.put("target", target);
            response.put("scan_type", scanType);
            response.put("result", scanResult);
            
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            response.put("status", "error");
            response.put("message", "Security scan failed: " + e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(response);
        }
    }
    
    // Logs endpoint
    @GetMapping("/logs")
    public ResponseEntity<Map<String, Object>> getLogs(
            @RequestParam(defaultValue = "100") int limit,
            @RequestParam(defaultValue = "INFO") String level) {
        Map<String, Object> response = new HashMap<>();
        
        try {
            // Simulate getting logs
            response.put("status", "success");
            response.put("logs", TaskExecutor.getLogs(limit, level));
            response.put("count", TaskExecutor.getLogs(limit, level).size());
            
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            response.put("status", "error");
            response.put("message", "Failed to retrieve logs: " + e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(response);
        }
    }
    
    // Web automation endpoint
    @PostMapping("/web/automate")
    public ResponseEntity<Map<String, Object>> webAutomation(@RequestBody Map<String, Object> automationRequest) {
        Map<String, Object> response = new HashMap<>();
        
        try {
            // Execute web automation
            Map<String, Object> automationResult = TaskExecutor.executeWebAutomation(automationRequest);
            
            response.put("status", "success");
            response.put("result", automationResult);
            
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            response.put("status", "error");
            response.put("message", "Web automation failed: " + e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(response);
        }
    }
    
    // AI processing endpoint
    @PostMapping("/ai/process")
    public ResponseEntity<Map<String, Object>> aiProcessing(@RequestBody Map<String, Object> aiRequest) {
        Map<String, Object> response = new HashMap<>();
        
        try {
            // Execute AI processing
            Map<String, Object> aiResult = TaskExecutor.executeAIProcessing(aiRequest);
            
            response.put("status", "success");
            response.put("result", aiResult);
            
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            response.put("status", "error");
            response.put("message", "AI processing failed: " + e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(response);
        }
    }
}