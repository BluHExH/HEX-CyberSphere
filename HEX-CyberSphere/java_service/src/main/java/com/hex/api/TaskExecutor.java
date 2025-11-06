package com.hex.api;

import java.util.*;
import java.util.concurrent.ThreadLocalRandom;

public class TaskExecutor {
    
    // Execute a task based on its name
    public static Map<String, Object> execute(String taskName, Map<String, Object> params) {
        Map<String, Object> result = new HashMap<>();
        
        switch (taskName) {
            case "data_processing":
                result = processData(params);
                break;
            case "security_scan":
                result = performSecurityScan((String) params.get("target"), (String) params.get("scan_type"));
                break;
            case "web_automation":
                result = executeWebAutomation(params);
                break;
            case "ai_analysis":
                result = executeAIProcessing(params);
                break;
            default:
                result.put("error", "Unknown task: " + taskName);
                break;
        }
        
        return result;
    }
    
    // Process data task
    private static Map<String, Object> processData(Map<String, Object> params) {
        Map<String, Object> result = new HashMap<>();
        result.put("task", "data_processing");
        result.put("status", "completed");
        result.put("processed_items", ThreadLocalRandom.current().nextInt(100, 1000));
        result.put("timestamp", System.currentTimeMillis());
        return result;
    }
    
    // Security scan task
    public static Map<String, Object> executeSecurityScan(String target, String scanType) {
        Map<String, Object> result = new HashMap<>();
        result.put("task", "security_scan");
        result.put("target", target);
        result.put("scan_type", scanType);
        result.put("status", "completed");
        
        // Simulate scan results
        List<Map<String, Object>> vulnerabilities = new ArrayList<>();
        if ("full".equals(scanType)) {
            Map<String, Object> vuln1 = new HashMap<>();
            vuln1.put("type", "open_port");
            vuln1.put("port", 22);
            vuln1.put("risk", "medium");
            vulnerabilities.add(vuln1);
            
            Map<String, Object> vuln2 = new HashMap<>();
            vuln2.put("type", "missing_header");
            vuln2.put("header", "X-Content-Type-Options");
            vuln2.put("risk", "low");
            vulnerabilities.add(vuln2);
        }
        
        result.put("vulnerabilities", vulnerabilities);
        result.put("timestamp", System.currentTimeMillis());
        return result;
    }
    
    // Perform security scan (wrapper)
    public static Map<String, Object> performSecurityScan(String target, String scanType) {
        return executeSecurityScan(target, scanType);
    }
    
    // Web automation task
    public static Map<String, Object> executeWebAutomation(Map<String, Object> params) {
        Map<String, Object> result = new HashMap<>();
        result.put("task", "web_automation");
        result.put("status", "completed");
        result.put("actions_executed", ThreadLocalRandom.current().nextInt(5, 20));
        result.put("timestamp", System.currentTimeMillis());
        return result;
    }
    
    // AI processing task
    public static Map<String, Object> executeAIProcessing(Map<String, Object> params) {
        Map<String, Object> result = new HashMap<>();
        result.put("task", "ai_processing");
        result.put("status", "completed");
        result.put("model_used", "RandomForestClassifier");
        result.put("predictions_made", ThreadLocalRandom.current().nextInt(10, 100));
        result.put("confidence", ThreadLocalRandom.current().nextDouble(0.8, 0.99));
        result.put("timestamp", System.currentTimeMillis());
        return result;
    }
    
    // AI processing (wrapper)
    public static Map<String, Object> performAIProcessing(Map<String, Object> params) {
        return executeAIProcessing(params);
    }
    
    // Web automation (wrapper)
    public static Map<String, Object> performWebAutomation(Map<String, Object> params) {
        return executeWebAutomation(params);
    }
    
    // Get task history
    public static List<Map<String, Object>> getTaskHistory() {
        List<Map<String, Object>> history = new ArrayList<>();
        
        // Add sample history items
        for (int i = 0; i < 10; i++) {
            Map<String, Object> task = new HashMap<>();
            task.put("id", i + 1);
            task.put("name", "sample_task_" + (i + 1));
            task.put("status", i % 3 == 0 ? "failed" : "completed");
            task.put("timestamp", System.currentTimeMillis() - (i * 3600000));
            history.add(task);
        }
        
        return history;
    }
    
    // Get logs
    public static List<Map<String, Object>> getLogs(int limit, String level) {
        List<Map<String, Object>> logs = new ArrayList<>();
        
        // Add sample logs
        String[] levels = {"INFO", "WARN", "ERROR"};
        String[] messages = {
            "System started successfully",
            "Task executed successfully",
            "Security scan completed",
            "Web automation in progress",
            "AI processing completed"
        };
        
        for (int i = 0; i < Math.min(limit, 20); i++) {
            Map<String, Object> log = new HashMap<>();
            log.put("id", i + 1);
            log.put("level", levels[ThreadLocalRandom.current().nextInt(levels.length)]);
            log.put("message", messages[ThreadLocalRandom.current().nextInt(messages.length)]);
            log.put("timestamp", System.currentTimeMillis() - (i * 60000));
            logs.add(log);
        }
        
        return logs;
    }
}