/*
HEX-CyberSphere Language Connector
Handles connections between different programming languages
*/

package main

import (
	"bytes"
	"encoding/json"
	"fmt"
	"net/http"
	"time"
)

// LanguageConnector manages connections between languages
type LanguageConnector struct {
	services map[string]ServiceInfo
}

// NewLanguageConnector creates a new language connector
func NewLanguageConnector() *LanguageConnector {
	return &LanguageConnector{
		services: make(map[string]ServiceInfo),
	}
}

// RegisterService registers a new service
func (lc *LanguageConnector) RegisterService(name, address string) {
	lc.services[name] = ServiceInfo{
		Name:    name,
		Status:  "registered",
		Address: address,
	}
}

// ConnectToService attempts to connect to a service
func (lc *LanguageConnector) ConnectToService(name string) error {
	service, exists := lc.services[name]
	if !exists {
		return fmt.Errorf("service %s not registered", name)
	}

	// Attempt to connect to the service
	url := fmt.Sprintf("http://%s/health", service.Address)
	resp, err := http.Get(url)
	if err != nil {
		service.Status = "disconnected"
		lc.services[name] = service
		return fmt.Errorf("failed to connect to %s: %v", name, err)
	}
	defer resp.Body.Close()

	if resp.StatusCode == http.StatusOK {
		service.Status = "connected"
		lc.services[name] = service
		return nil
	}

	service.Status = "disconnected"
	lc.services[name] = service
	return fmt.Errorf("service %s returned status %d", name, resp.StatusCode)
}

// SendRequest sends a request to a connected service
func (lc *LanguageConnector) SendRequest(serviceName string, endpoint string, data interface{}) (interface{}, error) {
	service, exists := lc.services[serviceName]
	if !exists {
		return nil, fmt.Errorf("service %s not registered", serviceName)
	}

	if service.Status != "connected" {
		return nil, fmt.Errorf("service %s is not connected", serviceName)
	}

	// Prepare request
	url := fmt.Sprintf("http://%s%s", service.Address, endpoint)
	jsonData, err := json.Marshal(data)
	if err != nil {
		return nil, fmt.Errorf("failed to marshal data: %v", err)
	}

	// Send request
	resp, err := http.Post(url, "application/json", bytes.NewBuffer(jsonData))
	if err != nil {
		return nil, fmt.Errorf("failed to send request to %s: %v", serviceName, err)
	}
	defer resp.Body.Close()

	// Parse response
	var result interface{}
	if err := json.NewDecoder(resp.Body).Decode(&result); err != nil {
		return nil, fmt.Errorf("failed to decode response from %s: %v", serviceName, err)
	}

	return result, nil
}

// GetServiceStatus returns the status of a service
func (lc *LanguageConnector) GetServiceStatus(name string) (ServiceInfo, error) {
	service, exists := lc.services[name]
	if !exists {
		return ServiceInfo{}, fmt.Errorf("service %s not found", name)
	}
	return service, nil
}

// GetAllServices returns all registered services
func (lc *LanguageConnector) GetAllServices() []ServiceInfo {
	services := make([]ServiceInfo, 0, len(lc.services))
	for _, service := range lc.services {
		services = append(services, service)
	}
	return services
}

// BroadcastMessage sends a message to all connected services
func (lc *LanguageConnector) BroadcastMessage(message interface{}) map[string]interface{} {
	results := make(map[string]interface{})

	for name, service := range lc.services {
		if service.Status == "connected" {
			result, err := lc.SendRequest(name, "/events", message)
			if err != nil {
				results[name] = map[string]string{"error": err.Error()}
			} else {
				results[name] = result
			}
		} else {
			results[name] = map[string]string{"status": "not connected"}
		}
	}

	return results
}

// MonitorServices periodically checks service health
func (lc *LanguageConnector) MonitorServices() {
	ticker := time.NewTicker(30 * time.Second)
	defer ticker.Stop()

	for range ticker.C {
		for name := range lc.services {
			// Attempt to reconnect disconnected services
			service := lc.services[name]
			if service.Status == "disconnected" {
				fmt.Printf("Attempting to reconnect to %s...\n", name)
				if err := lc.ConnectToService(name); err != nil {
					fmt.Printf("Failed to reconnect to %s: %v\n", name, err)
				} else {
					fmt.Printf("Successfully reconnected to %s\n", name)
				}
			} else if service.Status == "connected" {
				// Check if still connected
				if err := lc.ConnectToService(name); err != nil {
					fmt.Printf("Lost connection to %s: %v\n", name, err)
				}
			}
		}
	}
}