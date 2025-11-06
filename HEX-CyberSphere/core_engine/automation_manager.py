"""
HEX-CyberSphere Automation Manager
Main controller for automation workflows
"""

import json
import logging
import sqlite3
import time
from datetime import datetime
from typing import Dict, Any
import requests
from ai_controller import AIFramework
from data_parser import DataParser
from security_scanner import SecurityScanner
from notifier import NotificationManager

class AutomationManager:
    def __init__(self, config_path="../config/config.json"):
        self.logger = self._setup_logger()
        self.config = self._load_config(config_path)
        self.db_connection = self._setup_database()
        self.ai_framework = AIFramework()
        self.data_parser = DataParser()
        self.security_scanner = SecurityScanner()
        self.notifier = NotificationManager()
        
        self.logger.info("Automation Manager initialized")
    
    def _setup_logger(self):
        """Setup logging configuration"""
        logging.basicConfig(
            level=logging.INFO,
            format='%(asctime)s - %(name)s - %(levelname)s - %(message)s',
            handlers=[
                logging.FileHandler('../logs/automation_manager.log'),
                logging.StreamHandler()
            ]
        )
        return logging.getLogger(__name__)
    
    def _load_config(self, config_path: str) -> Dict[Any, Any]:
        """Load configuration from JSON file"""
        try:
            with open(config_path, 'r') as f:
                return json.load(f)
        except Exception as e:
            self.logger.error(f"Failed to load config: {e}")
            return {}
    
    def _setup_database(self):
        """Setup database connection"""
        try:
            conn = sqlite3.connect('../database/hex_data.db')
            return conn
        except Exception as e:
            self.logger.error(f"Failed to connect to database: {e}")
            return None
    
    def execute_task(self, task_name: str, task_params: Dict[Any, Any]) -> Dict[Any, Any]:
        """Execute an automation task"""
        self.logger.info(f"Executing task: {task_name}")
        
        try:
            # Log task execution
            self._log_event('task_execution', 'automation_manager', 
                           f"Executing task: {task_name}")
            
            # Task routing based on name
            if task_name == "ai_process":
                result = self._execute_ai_task(task_params)
            elif task_name == "security_scan":
                result = self._execute_security_task(task_params)
            elif task_name == "data_parse":
                result = self._execute_parsing_task(task_params)
            elif task_name == "web_automation":
                result = self._execute_web_task(task_params)
            else:
                result = {"error": f"Unknown task: {task_name}"}
            
            # Log result
            self._log_event('task_result', 'automation_manager', 
                           f"Task {task_name} completed: {json.dumps(result)}")
            
            return result
        except Exception as e:
            error_msg = f"Task execution failed: {str(e)}"
            self.logger.error(error_msg)
            self._log_event('task_error', 'automation_manager', error_msg)
            return {"error": error_msg}
    
    def _execute_ai_task(self, params: Dict[Any, Any]) -> Dict[Any, Any]:
        """Execute AI processing task"""
        self.logger.info("Executing AI processing task")
        
        try:
            data = params.get('data', {})
            operation = params.get('operation', 'process')
            
            if operation == 'process':
                result = self.ai_framework.process_data(data)
            elif operation == 'anomaly_detect':
                result = self.ai_framework.detect_anomalies(data)
            elif operation == 'predict_trends':
                result = self.ai_framework.predict_trends(data)
            else:
                result = {"error": f"Unknown AI operation: {operation}"}
            
            return result
        except Exception as e:
            error_msg = f"AI task execution failed: {str(e)}"
            self.logger.error(error_msg)
            return {"error": error_msg}
    
    def _execute_security_task(self, params: Dict[Any, Any]) -> Dict[Any, Any]:
        """Execute security scanning task"""
        self.logger.info("Executing security scanning task")
        
        try:
            target = params.get('target', 'localhost')
            scan_type = params.get('scan_type', 'basic')
            
            if scan_type == 'port_scan':
                result = self.security_scanner.scan_ports(target)
            elif scan_type == 'vulnerability_scan':
                result = self.security_scanner.scan_vulnerabilities(target)
            elif scan_type == 'full_scan':
                result = self.security_scanner.full_scan(target)
            else:
                result = {"error": f"Unknown scan type: {scan_type}"}
            
            return result
        except Exception as e:
            error_msg = f"Security task execution failed: {str(e)}"
            self.logger.error(error_msg)
            return {"error": error_msg}
    
    def _execute_parsing_task(self, params: Dict[Any, Any]) -> Dict[Any, Any]:
        """Execute data parsing task"""
        self.logger.info("Executing data parsing task")
        
        try:
            data = params.get('data', '')
            format_type = params.get('format', 'json')
            
            if format_type == 'json':
                result = self.data_parser.parse_json(data)
            elif format_type == 'yaml':
                result = self.data_parser.parse_yaml(data)
            elif format_type == 'csv':
                result = self.data_parser.parse_csv(data)
            elif format_type == 'xml':
                result = self.data_parser.parse_xml(data)
            else:
                result = {"error": f"Unknown format type: {format_type}"}
            
            return result
        except Exception as e:
            error_msg = f"Parsing task execution failed: {str(e)}"
            self.logger.error(error_msg)
            return {"error": error_msg}
    
    def _execute_web_task(self, params: Dict[Any, Any]) -> Dict[Any, Any]:
        """Execute web automation task"""
        self.logger.info("Executing web automation task")
        
        try:
            # Send request to Node.js service for web automation
            node_service_url = f"http://{self.config['services']['node_events']['host']}:{self.config['services']['node_events']['port']}/automate"
            
            response = requests.post(node_service_url, json=params, timeout=30)
            return response.json()
        except Exception as e:
            error_msg = f"Web automation task execution failed: {str(e)}"
            self.logger.error(error_msg)
            return {"error": error_msg}
    
    def health_check(self) -> Dict[Any, Any]:
        """Perform system health check"""
        self.logger.info("Performing system health check")
        
        health_status = {
            "timestamp": datetime.now().isoformat(),
            "system": "HEX-CyberSphere",
            "status": "healthy",
            "components": {}
        }
        
        # Check each service
        for service_name, service_config in self.config['services'].items():
            if service_config['enabled']:
                try:
                    url = f"http://{service_config['host']}:{service_config['port']}/health"
                    response = requests.get(url, timeout=5)
                    health_status["components"][service_name] = {
                        "status": "healthy" if response.status_code == 200 else "unhealthy",
                        "response_time": response.elapsed.total_seconds()
                    }
                except Exception as e:
                    health_status["components"][service_name] = {
                        "status": "unhealthy",
                        "error": str(e)
                    }
        
        # Check database
        try:
            cursor = self.db_connection.cursor()
            cursor.execute("SELECT 1")
            health_status["components"]["database"] = {"status": "healthy"}
        except Exception as e:
            health_status["components"]["database"] = {
                "status": "unhealthy",
                "error": str(e)
            }
        
        return health_status
    
    def _log_event(self, event_type: str, source: str, data: str):
        """Log event to database"""
        try:
            cursor = self.db_connection.cursor()
            cursor.execute("""
                INSERT INTO events (event_type, source, data) 
                VALUES (?, ?, ?)
            """, (event_type, source, data))
            self.db_connection.commit()
        except Exception as e:
            self.logger.error(f"Failed to log event: {e}")
    
    def get_task_history(self) -> Dict[Any, Any]:
        """Get task execution history"""
        try:
            cursor = self.db_connection.cursor()
            cursor.execute("""
                SELECT event_type, source, data, timestamp 
                FROM events 
                WHERE event_type IN ('task_execution', 'task_result', 'task_error')
                ORDER BY timestamp DESC 
                LIMIT 100
            """)
            
            rows = cursor.fetchall()
            history = [
                {
                    "event_type": row[0],
                    "source": row[1],
                    "data": row[2],
                    "timestamp": row[3]
                }
                for row in rows
            ]
            
            return {"history": history}
        except Exception as e:
            error_msg = f"Failed to retrieve task history: {str(e)}"
            self.logger.error(error_msg)
            return {"error": error_msg}

# Example usage
if __name__ == "__main__":
    manager = AutomationManager()
    
    # Example task execution
    task_params = {
        "data": {
            "metric1": [1, 2, 3, 4, 5, 100],
            "metric2": [10, 20, 30, 40, 50, 60]
        },
        "operation": "anomaly_detect"
    }
    
    print("Executing AI task...")
    result = manager.execute_task("ai_process", task_params)
    print(json.dumps(result, indent=2))
    
    print("\nPerforming health check...")
    health = manager.health_check()
    print(json.dumps(health, indent=2))