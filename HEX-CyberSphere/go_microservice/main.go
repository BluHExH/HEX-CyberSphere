/*
HEX-CyberSphere Go Microservice
Lightweight microservice connector between all languages
*/

package main

import (
	"encoding/json"
	"fmt"
	"log"
	"net/http"
	"os"
	"time"

	"github.com/gorilla/mux"
)

// SystemStatus represents the status of the system
type SystemStatus struct {
	Status      string    `json:"status"`
	Service     string    `json:"service"`
	Version     string    `json:"version"`
	Timestamp   time.Time `json:"timestamp"`
	Connections int       `json:"connections"`
}

// TaskRequest represents a task request
type TaskRequest struct {
	TaskName string                 `json:"task_name"`
	Params   map[string]interface{} `json:"params"`
}

// TaskResponse represents a task response
type TaskResponse struct {
	Status  string      `json:"status"`
	Task    string      `json:"task"`
	Result  interface{} `json:"result"`
	Message string      `json:"message,omitempty"`
}

// ServiceInfo represents information about a service
type ServiceInfo struct {
	Name    string `json:"name"`
	URL     string `json:"url"`
	Status  string `json:"status"`
	Version string `json:"version"`
}

// Global variables
var connections int
var services []ServiceInfo

func main() {
	// Display banner
	fmt.Println("╔════════════════════════════════════════════════╗")
	fmt.Println("║              ⚡ H E X – C Y B E R S P H E R E ⚡              ║")
	fmt.Println("╚════════════════════════════════════════════════╝")
	fmt.Println("     Go Microservice Connector")
	fmt.Println("  Listening on port 8082")
	fmt.Println("")

	// Initialize services
	initializeServices()

	// Create router
	router := mux.NewRouter()

	// Health check endpoint
	router.HandleFunc("/health", healthHandler).Methods("GET")

	// Status endpoint
	router.HandleFunc("/status", statusHandler).Methods("GET")

	// Execute task endpoint
	router.HandleFunc("/execute", executeTaskHandler).Methods("POST")

	// List services endpoint
	router.HandleFunc("/services", listServicesHandler).Methods("GET")

	// Connect service endpoint
	router.HandleFunc("/connect", connectServiceHandler).Methods("POST")

	// Start server
	port := os.Getenv("PORT")
	if port == "" {
		port = "8082"
	}

	fmt.Printf("HEX-CyberSphere Go Microservice running on port %s\n", port)
	log.Fatal(http.ListenAndServe(":"+port, router))
}

// initializeServices initializes the known services
func initializeServices() {
	services = []ServiceInfo{
		{
			Name:    "python_core",
			URL:     "http://localhost:5000",
			Status:  "active",
			Version: "1.0.0",
		},
		{
			Name:    "java_api",
			URL:     "http://localhost:8081",
			Status:  "active",
			Version: "1.0.0",
		},
		{
			Name:    "node_events",
			URL:     "http://localhost:3000",
			Status:  "active",
			Version: "1.0.0",
		},
		{
			Name:    "cpp_engine",
			URL:     "http://localhost:8083",
			Status:  "active",
			Version: "1.0.0",
		},
	}
}

// healthHandler handles health check requests
func healthHandler(w http.ResponseWriter, r *http.Request) {
	status := SystemStatus{
		Status:    "healthy",
		Service:   "go_microservice",
		Version:   "1.0.0",
		Timestamp: time.Now(),
	}

	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(status)
}

// statusHandler handles status requests
func statusHandler(w http.ResponseWriter, r *http.Request) {
	status := SystemStatus{
		Status:      "operational",
		Service:     "go_microservice",
		Version:     "1.0.0",
		Timestamp:   time.Now(),
		Connections: connections,
	}

	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(status)
}

// executeTaskHandler handles task execution requests
func executeTaskHandler(w http.ResponseWriter, r *http.Request) {
	var taskReq TaskRequest
	if err := json.NewDecoder(r.Body).Decode(&taskReq); err != nil {
		http.Error(w, "Invalid request body", http.StatusBadRequest)
		return
	}

	// Find the appropriate service
	service := findServiceForTask(taskReq.TaskName)
	if service == nil {
		response := TaskResponse{
			Status:  "error",
			Task:    taskReq.TaskName,
			Message: "No service found for task",
		}
		w.Header().Set("Content-Type", "application/json")
		json.NewEncoder(w).Encode(response)
		return
	}

	// Simulate task execution
	result := executeTask(taskReq.TaskName, taskReq.Params)

	response := TaskResponse{
		Status: "success",
		Task:   taskReq.TaskName,
		Result: result,
	}

	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(response)
}

// listServicesHandler handles service listing requests
func listServicesHandler(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(services)
}

// connectServiceHandler handles service connection requests
func connectServiceHandler(w http.ResponseWriter, r *http.Request) {
	var service ServiceInfo
	if err := json.NewDecoder(r.Body).Decode(&service); err != nil {
		http.Error(w, "Invalid request body", http.StatusBadRequest)
		return
	}

	// Add service to list
	services = append(services, service)

	response := TaskResponse{
		Status: "success",
		Task:   "connect_service",
		Result: fmt.Sprintf("Service %s connected", service.Name),
	}

	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(response)
}

// findServiceForTask finds the appropriate service for a task
func findServiceForTask(taskName string) *ServiceInfo {
	// Simple routing logic based on task name
	switch {
	case taskName == "ai_process" || taskName == "data_parse":
		return &services[0] // python_core
	case taskName == "api_call" || taskName == "security_scan":
		return &services[1] // java_api
	case taskName == "web_automation" || taskName == "realtime_event":
		return &services[2] // node_events
	case taskName == "encrypt" || taskName == "compress":
		return &services[3] // cpp_engine
	default:
		return &services[0] // default to python_core
	}
}

// executeTask executes a task (simulated)
func executeTask(taskName string, params map[string]interface{}) map[string]interface{} {
	result := make(map[string]interface{})

	switch taskName {
	case "ai_process":
		result["model"] = "neural_network"
		result["confidence"] = 0.95
		result["predictions"] = 10
	case "data_parse":
		result["format"] = "json"
		result["records"] = 1000
		result["fields"] = []string{"id", "name", "value"}
	case "security_scan":
		result["target"] = params["target"]
		result["vulnerabilities"] = 3
		result["scan_time"] = "2.5s"
	case "web_automation":
		result["url"] = params["url"]
		result["actions"] = 5
		result["status"] = "completed"
	case "encrypt":
		result["algorithm"] = "AES-256"
		result["data_size"] = "1KB"
		result["encrypted"] = true
	case "compress":
		result["algorithm"] = "gzip"
		result["original_size"] = "10MB"
		result["compressed_size"] = "2MB"
		result["ratio"] = "5:1"
	default:
		result["message"] = fmt.Sprintf("Task %s executed", taskName)
	}

	result["timestamp"] = time.Now().Format(time.RFC3339)
	return result
}