package com.example.scholartrack.service;

import com.example.scholartrack.entity.Verification;
import com.example.scholartrack.repository.VerificationRepository;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class VerificationService {

    private final VerificationRepository verificationRepository;

    public VerificationService(VerificationRepository verificationRepository) {
        this.verificationRepository = verificationRepository;
    }

    public Verification createVerification(Verification verification) {
        return verificationRepository.save(verification);
    }

    public List<Verification> getAllVerifications() {
        return verificationRepository.findAll();
    }

    public Optional<Verification> getVerificationById(Long id) {
        return verificationRepository.findById(id);
    }

    public Verification updateVerification(Long id, Verification verification) {

        Verification existingVerification =
                verificationRepository.findById(id)
                        .orElseThrow(() ->
                                new RuntimeException("Verification not found"));

        existingVerification.setApplication(
                verification.getApplication()
        );

        existingVerification.setStatus(
                verification.getStatus()
        );

        existingVerification.setRemarks(
                verification.getRemarks()
        );

        return verificationRepository.save(existingVerification);
    }
}