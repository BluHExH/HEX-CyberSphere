/*
HEX-CyberSphere C++ Encryption Module
High-speed encryption and hashing functions
*/

#include <iostream>
#include <string>
#include <vector>
#include <openssl/aes.h>
#include <openssl/sha.h>
#include <openssl/rand.h>
#include <iomanip>
#include <sstream>

class Encryptor {
private:
    std::vector<unsigned char> key;
    std::vector<unsigned char> iv;

public:
    Encryptor() {
        // Generate random key and IV
        key.resize(32); // 256 bits
        iv.resize(16);  // 128 bits
        RAND_bytes(key.data(), 32);
        RAND_bytes(iv.data(), 16);
    }

    // AES-256 encryption
    std::string encryptAES(const std::string& plaintext) {
        AES_KEY aesKey;
        AES_set_encrypt_key(key.data(), 256, &aesKey);

        // Pad plaintext to multiple of 16 bytes
        std::string padded = plaintext;
        int padding = 16 - (plaintext.length() % 16);
        padded.append(padding, static_cast<char>(padding));

        std::vector<unsigned char> ciphertext(padded.length());
        AES_cbc_encrypt(
            reinterpret_cast<const unsigned char*>(padded.c_str()),
            ciphertext.data(),
            padded.length(),
            &aesKey,
            iv.data(),
            AES_ENCRYPT
        );

        // Convert to hex string for easy transport
        std::stringstream ss;
        for (unsigned char c : ciphertext) {
            ss << std::hex << std::setw(2) << std::setfill('0') << static_cast<int>(c);
        }
        return ss.str();
    }

    // AES-256 decryption
    std::string decryptAES(const std::string& hexCiphertext) {
        // Convert hex string to bytes
        std::vector<unsigned char> ciphertext(hexCiphertext.length() / 2);
        for (size_t i = 0; i < hexCiphertext.length(); i += 2) {
            std::string byteString = hexCiphertext.substr(i, 2);
            ciphertext[i / 2] = static_cast<unsigned char>(std::stoi(byteString, nullptr, 16));
        }

        AES_KEY aesKey;
        AES_set_decrypt_key(key.data(), 256, &aesKey);

        std::vector<unsigned char> plaintext(ciphertext.size());
        AES_cbc_encrypt(
            ciphertext.data(),
            plaintext.data(),
            ciphertext.size(),
            &aesKey,
            iv.data(),
            AES_DECRYPT
        );

        // Remove padding
        int padding = plaintext.back();
        std::string result(plaintext.begin(), plaintext.end() - padding);
        return result;
    }

    // SHA-256 hashing
    std::string hashSHA256(const std::string& input) {
        unsigned char hash[SHA256_DIGEST_LENGTH];
        SHA256_CTX sha256;
        SHA256_Init(&sha256);
        SHA256_Update(&sha256, input.c_str(), input.length());
        SHA256_Final(hash, &sha256);

        std::stringstream ss;
        for (int i = 0; i < SHA256_DIGEST_LENGTH; i++) {
            ss << std::hex << std::setw(2) << std::setfill('0') << static_cast<int>(hash[i]);
        }
        return ss.str();
    }

    // Get key as hex string
    std::string getKeyHex() const {
        std::stringstream ss;
        for (unsigned char c : key) {
            ss << std::hex << std::setw(2) << std::setfill('0') << static_cast<int>(c);
        }
        return ss.str();
    }

    // Get IV as hex string
    std::string getIVHex() const {
        std::stringstream ss;
        for (unsigned char c : iv) {
            ss << std::hex << std::setw(2) << std::setfill('0') << static_cast<int>(c);
        }
        return ss.str();
    }
};

// Main function for testing
int main() {
    std::cout << "╔════════════════════════════════════════════════╗" << std::endl;
    std::cout << "║              ⚡ H E X – C Y B E R S P H E R E ⚡              ║" << std::endl;
    std::cout << "╚════════════════════════════════════════════════╝" << std::endl;
    std::cout << "     C++ Encryption Engine" << std::endl;
    std::cout << "  High-speed encryption and hashing" << std::endl;
    std::cout << std::endl;

    Encryptor encryptor;

    // Test encryption
    std::string plaintext = "Hello, HEX-CyberSphere!";
    std::cout << "Original text: " << plaintext << std::endl;

    std::string encrypted = encryptor.encryptAES(plaintext);
    std::cout << "Encrypted (hex): " << encrypted << std::endl;

    std::string decrypted = encryptor.decryptAES(encrypted);
    std::cout << "Decrypted: " << decrypted << std::endl;

    // Test hashing
    std::string hash = encryptor.hashSHA256(plaintext);
    std::cout << "SHA-256 hash: " << hash << std::endl;

    return 0;
}