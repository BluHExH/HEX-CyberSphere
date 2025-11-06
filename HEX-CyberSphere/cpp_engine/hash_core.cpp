/*
HEX-CyberSphere C++ Hashing Module
High-speed hashing functions for data integrity
*/

#include <iostream>
#include <string>
#include <vector>
#include <openssl/md5.h>
#include <openssl/sha.h>
#include <iomanip>
#include <sstream>
#include <chrono>

class HashCore {
public:
    // MD5 hashing
    std::string hashMD5(const std::string& input) {
        unsigned char digest[MD5_DIGEST_LENGTH];
        MD5(reinterpret_cast<const unsigned char*>(input.c_str()), input.length(), digest);

        std::stringstream ss;
        for (int i = 0; i < MD5_DIGEST_LENGTH; i++) {
            ss << std::hex << std::setw(2) << std::setfill('0') << static_cast<int>(digest[i]);
        }
        return ss.str();
    }

    // SHA-1 hashing
    std::string hashSHA1(const std::string& input) {
        unsigned char digest[SHA_DIGEST_LENGTH];
        SHA1(reinterpret_cast<const unsigned char*>(input.c_str()), input.length(), digest);

        std::stringstream ss;
        for (int i = 0; i < SHA_DIGEST_LENGTH; i++) {
            ss << std::hex << std::setw(2) << std::setfill('0') << static_cast<int>(digest[i]);
        }
        return ss.str();
    }

    // SHA-256 hashing
    std::string hashSHA256(const std::string& input) {
        unsigned char digest[SHA256_DIGEST_LENGTH];
        SHA256_CTX sha256;
        SHA256_Init(&sha256);
        SHA256_Update(&sha256, input.c_str(), input.length());
        SHA256_Final(digest, &sha256);

        std::stringstream ss;
        for (int i = 0; i < SHA256_DIGEST_LENGTH; i++) {
            ss << std::hex << std::setw(2) << std::setfill('0') << static_cast<int>(digest[i]);
        }
        return ss.str();
    }

    // SHA-512 hashing
    std::string hashSHA512(const std::string& input) {
        unsigned char digest[SHA512_DIGEST_LENGTH];
        SHA512_CTX sha512;
        SHA512_Init(&sha512);
        SHA512_Update(&sha512, input.c_str(), input.length());
        SHA512_Final(digest, &sha512);

        std::stringstream ss;
        for (int i = 0; i < SHA512_DIGEST_LENGTH; i++) {
            ss << std::hex << std::setw(2) << std::setfill('0') << static_cast<int>(digest[i]);
        }
        return ss.str();
    }

    // Benchmark hashing performance
    double benchmarkHash(const std::string& input, const std::string& hashType, int iterations = 1000) {
        auto start = std::chrono::high_resolution_clock::now();

        for (int i = 0; i < iterations; i++) {
            if (hashType == "md5") {
                hashMD5(input);
            } else if (hashType == "sha1") {
                hashSHA1(input);
            } else if (hashType == "sha256") {
                hashSHA256(input);
            } else if (hashType == "sha512") {
                hashSHA512(input);
            }
        }

        auto end = std::chrono::high_resolution_clock::now();
        auto duration = std::chrono::duration_cast<std::chrono::microseconds>(end - start);
        return duration.count() / static_cast<double>(iterations);
    }

    // Verify data integrity
    bool verifyIntegrity(const std::string& data, const std::string& expectedHash, const std::string& hashType) {
        std::string actualHash;
        
        if (hashType == "md5") {
            actualHash = hashMD5(data);
        } else if (hashType == "sha1") {
            actualHash = hashSHA1(data);
        } else if (hashType == "sha256") {
            actualHash = hashSHA256(data);
        } else if (hashType == "sha512") {
            actualHash = hashSHA512(data);
        } else {
            return false;
        }

        return actualHash == expectedHash;
    }
};

// Main function for testing
int main() {
    std::cout << "╔════════════════════════════════════════════════╗" << std::endl;
    std::cout << "║              ⚡ H E X – C Y B E R S P H E R E ⚡              ║" << std::endl;
    std::cout << "╚════════════════════════════════════════════════╝" << std::endl;
    std::cout << "     C++ Hashing Engine" << std::endl;
    std::cout << "  High-speed data integrity verification" << std::endl;
    std::cout << std::endl;

    HashCore hasher;

    // Test data
    std::string testData = "HEX-CyberSphere data integrity test";
    std::cout << "Test data: " << testData << std::endl;
    std::cout << std::endl;

    // Test different hash algorithms
    std::string md5Hash = hasher.hashMD5(testData);
    std::cout << "MD5: " << md5Hash << std::endl;

    std::string sha1Hash = hasher.hashSHA1(testData);
    std::cout << "SHA-1: " << sha1Hash << std::endl;

    std::string sha256Hash = hasher.hashSHA256(testData);
    std::cout << "SHA-256: " << sha256Hash << std::endl;

    std::string sha512Hash = hasher.hashSHA512(testData);
    std::cout << "SHA-512: " << sha512Hash << std::endl;

    std::cout << std::endl;

    // Test data integrity verification
    bool md5Valid = hasher.verifyIntegrity(testData, md5Hash, "md5");
    bool sha256Valid = hasher.verifyIntegrity(testData, sha256Hash, "sha256");

    std::cout << "MD5 integrity check: " << (md5Valid ? "PASSED" : "FAILED") << std::endl;
    std::cout << "SHA-256 integrity check: " << (sha256Valid ? "PASSED" : "FAILED") << std::endl;

    std::cout << std::endl;

    // Benchmark performance
    std::cout << "Performance benchmarks (average microseconds per hash):" << std::endl;
    std::cout << "MD5: " << hasher.benchmarkHash(testData, "md5") << " μs" << std::endl;
    std::cout << "SHA-1: " << hasher.benchmarkHash(testData, "sha1") << " μs" << std::endl;
    std::cout << "SHA-256: " << hasher.benchmarkHash(testData, "sha256") << " μs" << std::endl;
    std::cout << "SHA-512: " << hasher.benchmarkHash(testData, "sha512") << " μs" << std::endl;

    return 0;
}