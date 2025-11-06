#!/bin/bash

# HEX-CyberSphere Log Cleaner
echo "Cleaning HEX-CyberSphere logs..."

# Remove log files older than 7 days
find ../logs -name "*.log" -type f -mtime +7 -delete 2>/dev/null

# Clear current log files (keep last 1000 lines)
for log in ../logs/*.log; do
    if [ -f "$log" ]; then
        echo "Cleaning $log..."
        tail -1000 "$log" > "$log.tmp" && mv "$log.tmp" "$log"
    fi
done

# Clean database logs table
echo "Cleaning database logs..."
cd ../database
sqlite3 hex_data.db "DELETE FROM logs WHERE timestamp < datetime('now', '-7 days');"

echo "Log cleaning completed."