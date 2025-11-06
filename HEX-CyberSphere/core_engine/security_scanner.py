"""
HEX-CyberSphere Security Scanner
Handles security scanning and vulnerability detection
"""

import socket
import subprocess
import json
import logging
from typing import Dict, Any, List
import requests

class SecurityScanner:
    def __init__(self):
        self.logger = logging.getLogger(__name__)
        self.logger.info("Security Scanner initialized")
    
    def scan_ports(self, target: str, port_range: str = "1-1000") -> Dict[Any, Any]:
        """Scan open ports on a target"""
        self.logger.info(f"Scanning ports on {target}")
        
        try:
            open_ports = []
            start_port, end_port = map(int, port_range.split('-'))
            
            for port in range(start_port, end_port + 1):
                sock = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
                sock.settimeout(0.1)  # 100ms timeout
                
                result = sock.connect_ex((target, port))
                if result == 0:
                    # Port is open
                    try:
                        service = socket.getservbyport(port)
                    except:
                        service = "unknown"
                    
                    open_ports.append({
                        "port": port,
                        "service": service,
                        "status": "open"
                    })
                
                sock.close()
            
            return {
                "target": target,
                "scan_type": "port_scan",
                "open_ports": open_ports,
                "total_scanned": end_port - start_port + 1
            }
        except Exception as e:
            error_msg = f"Port scanning failed: {str(e)}"
            self.logger.error(error_msg)
            return {"error": error_msg}
    
    def scan_vulnerabilities(self, target: str) -> Dict[Any, Any]:
        """Scan for common vulnerabilities"""
        self.logger.info(f"Scanning vulnerabilities on {target}")
        
        try:
            vulnerabilities = []
            
            # Check for common vulnerabilities
            # 1. Check if common ports are open with weak services
            common_ports = [
                (21, "FTP"), (22, "SSH"), (23, "Telnet"), 
                (80, "HTTP"), (443, "HTTPS"), (3389, "RDP")
            ]
            
            for port, service_name in common_ports:
                sock = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
                sock.settimeout(0.5)
                
                result = sock.connect_ex((target, port))
                if result == 0:
                    vulnerabilities.append({
                        "type": "open_port",
                        "port": port,
                        "service": service_name,
                        "risk": "info" if port in [80, 443] else "medium",
                        "description": f"{service_name} service running on port {port}"
                    })
                
                sock.close()
            
            # 2. Check for HTTP headers security issues
            try:
                response = requests.get(f"http://{target}", timeout=5)
                headers = response.headers
                
                # Check for missing security headers
                security_headers = [
                    "X-Content-Type-Options",
                    "X-Frame-Options", 
                    "X-XSS-Protection",
                    "Strict-Transport-Security"
                ]
                
                missing_headers = []
                for header in security_headers:
                    if header not in headers:
                        missing_headers.append(header)
                
                if missing_headers:
                    vulnerabilities.append({
                        "type": "missing_security_headers",
                        "risk": "medium",
                        "description": f"Missing security headers: {', '.join(missing_headers)}",
                        "headers": missing_headers
                    })
            except:
                pass  # Ignore if HTTP service is not available
            
            return {
                "target": target,
                "scan_type": "vulnerability_scan",
                "vulnerabilities": vulnerabilities,
                "total_found": len(vulnerabilities)
            }
        except Exception as e:
            error_msg = f"Vulnerability scanning failed: {str(e)}"
            self.logger.error(error_msg)
            return {"error": error_msg}
    
    def full_scan(self, target: str) -> Dict[Any, Any]:
        """Perform a full security scan"""
        self.logger.info(f"Performing full security scan on {target}")
        
        try:
            # Run port scan
            port_results = self.scan_ports(target)
            
            # Run vulnerability scan
            vuln_results = self.scan_vulnerabilities(target)
            
            # Combine results
            combined_results = {
                "target": target,
                "scan_type": "full_scan",
                "timestamp": __import__('datetime').datetime.now().isoformat(),
                "port_scan": port_results,
                "vulnerability_scan": vuln_results,
                "summary": {
                    "total_open_ports": len(port_results.get("open_ports", [])),
                    "total_vulnerabilities": len(vuln_results.get("vulnerabilities", []))
                }
            }
            
            return combined_results
        except Exception as e:
            error_msg = f"Full security scan failed: {str(e)}"
            self.logger.error(error_msg)
            return {"error": error_msg}
    
    def check_api_security(self, api_url: str) -> Dict[Any, Any]:
        """Check security of an API endpoint"""
        self.logger.info(f"Checking API security for {api_url}")
        
        try:
            vulnerabilities = []
            
            # Check if API requires authentication
            try:
                response = requests.get(api_url, timeout=5)
                
                # If we can access without auth, it's a potential issue
                if response.status_code == 200:
                    vulnerabilities.append({
                        "type": "unauthenticated_access",
                        "risk": "high",
                        "description": "API endpoint accessible without authentication"
                    })
            except:
                pass  # Ignore connection errors
            
            # Check for common API security issues would go here
            # This is a simplified version
            
            return {
                "api_url": api_url,
                "vulnerabilities": vulnerabilities,
                "total_found": len(vulnerabilities)
            }
        except Exception as e:
            error_msg = f"API security check failed: {str(e)}"
            self.logger.error(error_msg)
            return {"error": error_msg}

# Example usage
if __name__ == "__main__":
    scanner = SecurityScanner()
    
    # Test port scanning
    print("Scanning ports on localhost...")
    port_results = scanner.scan_ports("localhost", "80-100")
    print(json.dumps(port_results, indent=2))
    
    # Test vulnerability scanning
    print("\nScanning vulnerabilities on localhost...")
    vuln_results = scanner.scan_vulnerabilities("localhost")
    print(json.dumps(vuln_results, indent=2))