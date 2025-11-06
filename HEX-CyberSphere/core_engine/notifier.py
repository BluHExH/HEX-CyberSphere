"""
HEX-CyberSphere Notification Manager
Handles sending notifications via various channels
"""

import json
import logging
import smtplib
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart
import requests
from typing import Dict, Any

class NotificationManager:
    def __init__(self, config_path="../config/config.json"):
        self.logger = logging.getLogger(__name__)
        self.config = self._load_config(config_path)
        self.logger.info("Notification Manager initialized")
    
    def _load_config(self, config_path: str) -> Dict[Any, Any]:
        """Load configuration from JSON file"""
        try:
            with open(config_path, 'r') as f:
                return json.load(f)
        except Exception as e:
            self.logger.error(f"Failed to load config: {e}")
            return {}
    
    def send_discord_notification(self, message: str, webhook_url: str = None) -> bool:
        """Send notification via Discord webhook"""
        try:
            if not webhook_url:
                webhook_url = self.config.get('notifications', {}).get('discord', {}).get('webhook_url')
            
            if not webhook_url:
                self.logger.warning("Discord webhook URL not configured")
                return False
            
            payload = {
                "content": message,
                "username": "HEX-CyberSphere"
            }
            
            response = requests.post(webhook_url, json=payload)
            return response.status_code == 204
        except Exception as e:
            self.logger.error(f"Failed to send Discord notification: {e}")
            return False
    
    def send_telegram_notification(self, message: str, bot_token: str = None, chat_id: str = None) -> bool:
        """Send notification via Telegram bot"""
        try:
            if not bot_token:
                bot_token = self.config.get('notifications', {}).get('telegram', {}).get('bot_token')
            
            if not chat_id:
                chat_id = self.config.get('notifications', {}).get('telegram', {}).get('chat_id')
            
            if not bot_token or not chat_id:
                self.logger.warning("Telegram bot token or chat ID not configured")
                return False
            
            url = f"https://api.telegram.org/bot{bot_token}/sendMessage"
            payload = {
                "chat_id": chat_id,
                "text": message
            }
            
            response = requests.post(url, json=payload)
            return response.status_code == 200
        except Exception as e:
            self.logger.error(f"Failed to send Telegram notification: {e}")
            return False
    
    def send_email_notification(self, subject: str, message: str, 
                               recipient: str = None, smtp_config: Dict[Any, Any] = None) -> bool:
        """Send notification via email"""
        try:
            if not smtp_config:
                smtp_config = self.config.get('notifications', {}).get('email', {})
            
            if not smtp_config.get('enabled'):
                self.logger.warning("Email notifications not enabled")
                return False
            
            # Create message
            msg = MIMEMultipart()
            msg['From'] = smtp_config.get('username')
            msg['To'] = recipient or smtp_config.get('username')
            msg['Subject'] = subject
            
            msg.attach(MIMEText(message, 'plain'))
            
            # Connect to server and send email
            server = smtplib.SMTP(smtp_config.get('smtp_server'), smtp_config.get('port'))
            server.starttls()
            server.login(smtp_config.get('username'), smtp_config.get('password'))
            
            text = msg.as_string()
            server.sendmail(smtp_config.get('username'), 
                           recipient or smtp_config.get('username'), text)
            server.quit()
            
            return True
        except Exception as e:
            self.logger.error(f"Failed to send email notification: {e}")
            return False
    
    def send_notification(self, message: str, channels: list = None) -> Dict[str, bool]:
        """Send notification via multiple channels"""
        if not channels:
            # Use all enabled channels
            channels = []
            notifications_config = self.config.get('notifications', {})
            
            if notifications_config.get('discord', {}).get('enabled'):
                channels.append('discord')
            
            if notifications_config.get('telegram', {}).get('enabled'):
                channels.append('telegram')
            
            if notifications_config.get('email', {}).get('enabled'):
                channels.append('email')
        
        results = {}
        
        for channel in channels:
            if channel == 'discord':
                results[channel] = self.send_discord_notification(message)
            elif channel == 'telegram':
                results[channel] = self.send_telegram_notification(message)
            elif channel == 'email':
                results[channel] = self.send_email_notification("HEX-CyberSphere Notification", message)
            else:
                self.logger.warning(f"Unknown notification channel: {channel}")
                results[channel] = False
        
        return results
    
    def generate_report(self, report_data: Dict[Any, Any] = None) -> str:
        """Generate a system status report"""
        try:
            if not report_data:
                # Generate a default report
                report_data = {
                    "system": "HEX-CyberSphere",
                    "status": "Operational",
                    "timestamp": __import__('datetime').datetime.now().isoformat(),
                    "summary": "System is running normally"
                }
            
            # Format report
            report_lines = [
                "=== HEX-CyberSphere System Report ===",
                f"Generated: {report_data.get('timestamp', 'N/A')}",
                f"System: {report_data.get('system', 'N/A')}",
                f"Status: {report_data.get('status', 'N/A')}",
                "",
                f"Summary: {report_data.get('summary', 'N/A')}"
            ]
            
            # Add additional sections if available
            if 'tasks' in report_data:
                report_lines.append("\n=== Task Summary ===")
                for task in report_data['tasks']:
                    report_lines.append(f"- {task}")
            
            if 'alerts' in report_data:
                report_lines.append("\n=== Alerts ===")
                for alert in report_data['alerts']:
                    report_lines.append(f"- {alert}")
            
            report = "\n".join(report_lines)
            return report
        except Exception as e:
            self.logger.error(f"Failed to generate report: {e}")
            return "Failed to generate report"

# Example usage
if __name__ == "__main__":
    notifier = NotificationManager()
    
    # Test notification sending
    print("Sending test notification...")
    results = notifier.send_notification("HEX-CyberSphere system test notification")
    print(json.dumps(results, indent=2))
    
    # Test report generation
    print("\nGenerating system report...")
    report_data = {
        "system": "HEX-CyberSphere",
        "status": "Operational",
        "timestamp": "2024-01-01T12:00:00Z",
        "summary": "All systems operational",
        "tasks": ["Data processing completed", "Security scan finished"],
        "alerts": ["Minor performance degradation detected"]
    }
    
    report = notifier.generate_report(report_data)
    print(report)