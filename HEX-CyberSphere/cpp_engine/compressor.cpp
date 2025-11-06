/*
HEX-CyberSphere C++ Compression Module
High-speed data compression and decompression
*/

#include <iostream>
#include <string>
#include <vector>
#include <zlib.h>
#include <iomanip>
#include <sstream>

class Compressor {
public:
    // Compress data using zlib
    std::string compress(const std::string& data) {
        z_stream zs;
        memset(&zs, 0, sizeof(zs));

        if (deflateInit(&zs, Z_BEST_COMPRESSION) != Z_OK) {
            throw std::runtime_error("deflateInit failed");
        }

        zs.next_in = reinterpret_cast<Bytef*>(const_cast<char*>(data.data()));
        zs.avail_in = data.size();

        int ret;
        char outbuffer[32768];
        std::string outstring;

        do {
            zs.next_out = reinterpret_cast<Bytef*>(outbuffer);
            zs.avail_out = sizeof(outbuffer);

            ret = deflate(&zs, Z_SYNC_FLUSH);

            if (outstring.size() < zs.total_out) {
                outstring.append(outbuffer, zs.total_out - outstring.size());
            }
        } while (ret == Z_OK);

        deflateEnd(&zs);

        if (ret != Z_STREAM_END) {
            throw std::runtime_error("Exception during zlib compression");
        }

        // Convert to hex string for easy transport
        std::stringstream ss;
        for (unsigned char c : outstring) {
            ss << std::hex << std::setw(2) << std::setfill('0') << static_cast<int>(c);
        }
        return ss.str();
    }

    // Decompress data using zlib
    std::string decompress(const std::string& hexCompressed) {
        // Convert hex string to bytes
        std::vector<unsigned char> compressed(hexCompressed.length() / 2);
        for (size_t i = 0; i < hexCompressed.length(); i += 2) {
            std::string byteString = hexCompressed.substr(i, 2);
            compressed[i / 2] = static_cast<unsigned char>(std::stoi(byteString, nullptr, 16));
        }

        z_stream zs;
        memset(&zs, 0, sizeof(zs));

        if (inflateInit(&zs) != Z_OK) {
            throw std::runtime_error("inflateInit failed");
        }

        zs.next_in = reinterpret_cast<Bytef*>(compressed.data());
        zs.avail_in = compressed.size();

        int ret;
        char outbuffer[32768];
        std::string outstring;

        do {
            zs.next_out = reinterpret_cast<Bytef*>(outbuffer);
            zs.avail_out = sizeof(outbuffer);

            ret = inflate(&zs, Z_SYNC_FLUSH);

            if (outstring.size() < zs.total_out) {
                outstring.append(outbuffer, zs.total_out - outstring.size());
            }
        } while (ret == Z_OK);

        inflateEnd(&zs);

        if (ret != Z_STREAM_END) {
            throw std::runtime_error("Exception during zlib decompression");
        }

        return outstring;
    }

    // Calculate compression ratio
    double calculateRatio(const std::string& original, const std::string& compressed) {
        if (original.empty()) return 0.0;
        return static_cast<double>(compressed.length()) / static_cast<double>(original.length());
    }
};

// Main function for testing
int main() {
    std::cout << "╔════════════════════════════════════════════════╗" << std::endl;
    std::cout << "║              ⚡ H E X – C Y B E R S P H E R E ⚡              ║" << std::endl;
    std::cout << "╚════════════════════════════════════════════════╝" << std::endl;
    std::cout << "     C++ Compression Engine" << std::endl;
    std::cout << "  High-speed data compression" << std::endl;
    std::cout << std::endl;

    Compressor compressor;

    // Test compression
    std::string original = "This is a test string for compression. ";
    // Repeat the string to make it larger
    for (int i = 0; i < 10; i++) {
        original += original;
    }

    std::cout << "Original size: " << original.length() << " bytes" << std::endl;

    try {
        std::string compressed = compressor.compress(original);
        std::cout << "Compressed size: " << compressed.length() / 2 << " bytes" << std::endl;

        double ratio = compressor.calculateRatio(original, compressed);
        std::cout << "Compression ratio: " << std::fixed << std::setprecision(2) << ratio << std::endl;

        std::string decompressed = compressor.decompress(compressed);
        std::cout << "Decompression successful: " << (decompressed == original ? "YES" : "NO") << std::endl;
    } catch (const std::exception& e) {
        std::cerr << "Error: " << e.what() << std::endl;
    }

    return 0;
}