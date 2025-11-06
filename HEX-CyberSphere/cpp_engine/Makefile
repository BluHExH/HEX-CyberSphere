# HEX-CyberSphere C++ Engine Makefile

# Compiler and flags
CXX = g++
CXXFLAGS = -std=c++11 -O3 -Wall -Wextra
LDFLAGS = -lssl -lcrypto -lz

# Source files
SOURCES = main.cpp encryptor.cpp compressor.cpp hash_core.cpp
OBJECTS = $(SOURCES:.cpp=.o)
TARGET = cpp_engine

# Default target
all: $(TARGET)

# Link the executable
$(TARGET): $(OBJECTS)
	$(CXX) $(OBJECTS) -o $(TARGET) $(LDFLAGS)

# Compile source files
%.o: %.cpp
	$(CXX) $(CXXFLAGS) -c $< -o $@

# Clean build files
clean:
	rm -f $(OBJECTS) $(TARGET)

# Install dependencies (Ubuntu/Debian)
install-deps:
	sudo apt-get update
	sudo apt-get install -y build-essential libssl-dev zlib1g-dev

# Run the engine
run: $(TARGET)
	./$(TARGET)

# Install the engine
install: $(TARGET)
	sudo cp $(TARGET) /usr/local/bin/

# Help
help:
	@echo "HEX-CyberSphere C++ Engine Makefile"
	@echo "Available targets:"
	@echo "  all       - Build the engine (default)"
	@echo "  clean     - Remove build files"
	@echo "  install-deps - Install required dependencies"
	@echo "  run       - Build and run the engine"
	@echo "  install   - Install the engine system-wide"
	@echo "  help      - Show this help message"

.PHONY: all clean install-deps run install help