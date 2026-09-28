package com.example.scholartrack.controller;

import com.example.scholartrack.entity.Verification;
import com.example.scholartrack.service.VerificationService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/verifications")
public class VerificationController {

    private final VerificationService verificationService;

    public VerificationController(VerificationService verificationService) {
        this.verificationService = verificationService;
    }

    @PostMapping
    public Verification createVerification(
            @RequestBody Verification verification) {

        return verificationService.createVerification(verification);
    }

    @GetMapping
    public List<Verification> getAllVerifications() {

        return verificationService.getAllVerifications();
    }

    @GetMapping("/{id}")
    public ResponseEntity<Verification> getVerificationById(
            @PathVariable Long id) {

        return verificationService.getVerificationById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PutMapping("/{id}")
    public Verification updateVerification(
            @PathVariable Long id,
            @RequestBody Verification verification) {

        return verificationService.updateVerification(id, verification);
    }
}