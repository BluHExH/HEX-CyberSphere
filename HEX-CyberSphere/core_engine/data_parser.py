"""
HEX-CyberSphere Data Parser
Handles parsing and transformation of various data formats
"""

import json
import yaml
import csv
import xml.etree.ElementTree as ET
import pandas as pd
import logging
from typing import Dict, Any, List

class DataParser:
    def __init__(self):
        self.logger = logging.getLogger(__name__)
    
    def parse_json(self, data: str) -> Dict[Any, Any]:
        """Parse JSON data"""
        try:
            return json.loads(data)
        except json.JSONDecodeError as e:
            self.logger.error(f"JSON parsing error: {e}")
            return {'error': f'JSON parsing failed: {str(e)}'}
    
    def parse_yaml(self, data: str) -> Dict[Any, Any]:
        """Parse YAML data"""
        try:
            return yaml.safe_load(data)
        except yaml.YAMLError as e:
            self.logger.error(f"YAML parsing error: {e}")
            return {'error': f'YAML parsing failed: {str(e)}'}
    
    def parse_csv(self, data: str) -> List[Dict[str, Any]]:
        """Parse CSV data"""
        try:
            lines = data.strip().split('\n')
            reader = csv.DictReader(lines)
            return list(reader)
        except Exception as e:
            self.logger.error(f"CSV parsing error: {e}")
            return [{'error': f'CSV parsing failed: {str(e)}'}]
    
    def parse_xml(self, data: str) -> Dict[str, Any]:
        """Parse XML data"""
        try:
            root = ET.fromstring(data)
            return self._xml_to_dict(root)
        except ET.ParseError as e:
            self.logger.error(f"XML parsing error: {e}")
            return {'error': f'XML parsing failed: {str(e)}'}
    
    def _xml_to_dict(self, element: ET.Element) -> Dict[str, Any]:
        """Convert XML element to dictionary"""
        result = {}
        
        # Add attributes
        if element.attrib:
            result['@attributes'] = element.attrib
        
        # Add text content
        if element.text and element.text.strip():
            if len(element) == 0:
                return element.text.strip()
            result['#text'] = element.text.strip()
        
        # Add children
        for child in element:
            child_data = self._xml_to_dict(child)
            if child.tag in result:
                if not isinstance(result[child.tag], list):
                    result[child.tag] = [result[child.tag]]
                result[child.tag].append(child_data)
            else:
                result[child.tag] = child_data
        
        return result
    
    def convert_format(self, data: Any, from_format: str, to_format: str) -> str:
        """Convert data between formats"""
        try:
            if from_format == 'json' and to_format == 'yaml':
                parsed = self.parse_json(data)
                return yaml.dump(parsed, default_flow_style=False)
            elif from_format == 'yaml' and to_format == 'json':
                parsed = self.parse_yaml(data)
                return json.dumps(parsed, indent=2)
            elif from_format == 'csv' and to_format == 'json':
                parsed = self.parse_csv(data)
                return json.dumps(parsed, indent=2)
            else:
                return json.dumps({'error': f'Conversion from {from_format} to {to_format} not supported'})
        except Exception as e:
            self.logger.error(f"Format conversion error: {e}")
            return json.dumps({'error': f'Conversion failed: {str(e)}'})

# Example usage
if __name__ == "__main__":
    parser = DataParser()
    
    # Test JSON parsing
    json_data = '{"name": "HEX-CyberSphere", "version": "1.0.0", "features": ["AI", "Automation", "Security"]}'
    print("JSON Data:")
    print(json.dumps(parser.parse_json(json_data), indent=2))
    
    # Test YAML parsing
    yaml_data = """
    name: HEX-CyberSphere
    version: 1.0.0
    features:
      - AI
      - Automation
      - Security
    """
    print("\nYAML Data:")
    print(json.dumps(parser.parse_yaml(yaml_data), indent=2))
    
    # Test CSV parsing
    csv_data = """name,version,feature
HEX-CyberSphere,1.0.0,AI
HEX-CyberSphere,1.0.0,Security
HEX-CyberSphere,1.0.0,Web Automation"""
    print("\nCSV Data:")
    print(json.dumps(parser.parse_csv(csv_data), indent=2))