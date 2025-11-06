package com.hex.api;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

@SpringBootApplication
public class Application {
    public static void main(String[] args) {
        SpringApplication.run(Application.class, args);
        System.out.println("╔════════════════════════════════════════════════╗");
        System.out.println("║              ⚡ H E X – C Y B E R S P H E R E ⚡              ║");
        System.out.println("╚════════════════════════════════════════════════╝");
        System.out.println("     Java REST API Service Started");
        System.out.println("  Listening on port 8081");
    }
}