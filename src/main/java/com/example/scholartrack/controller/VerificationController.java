package com.example.scholartrack.controller;

import com.example.scholartrack.entity.Verification;
import com.example.scholartrack.service.VerificationService;
import jakarta.validation.Valid;
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

    // CREATE VERIFICATION
    @PostMapping
    public Verification createVerification(
            @Valid @RequestBody Verification verification) {

        return verificationService.createVerification(verification);
    }

    // GET ALL VERIFICATIONS
    @GetMapping
    public List<Verification> getAllVerifications() {
        return verificationService.getAllVerifications();
    }

    // GET VERIFICATION BY ID
    @GetMapping("/{id}")
    public ResponseEntity<Verification> getVerificationById(
            @PathVariable Long id) {

        return verificationService.getVerificationById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    // UPDATE VERIFICATION
    @PutMapping("/{id}")
    public Verification updateVerification(
            @PathVariable Long id,
            @Valid @RequestBody Verification verification) {

        return verificationService.updateVerification(id, verification);
    }
}