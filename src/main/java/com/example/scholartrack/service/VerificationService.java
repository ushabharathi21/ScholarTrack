package com.example.scholartrack.service;

import com.example.scholartrack.entity.Application;
import com.example.scholartrack.entity.Verification;
import com.example.scholartrack.exception.ResourceNotFoundException;
import com.example.scholartrack.repository.ApplicationRepository;
import com.example.scholartrack.repository.VerificationRepository;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class VerificationService {

    private final VerificationRepository verificationRepository;
    private final ApplicationRepository applicationRepository;

    public VerificationService(
            VerificationRepository verificationRepository,
            ApplicationRepository applicationRepository) {

        this.verificationRepository = verificationRepository;
        this.applicationRepository = applicationRepository;
    }

    public Verification createVerification(
            Verification verification) {

        Long applicationId =
                verification.getApplication().getId();

        Application application =
                applicationRepository.findById(applicationId)
                        .orElseThrow(() ->
                                new ResourceNotFoundException(
                                        "Application not found"
                                ));

        verification.setApplication(application);

        return verificationRepository.save(verification);
    }

    public List<Verification> getAllVerifications() {

        return verificationRepository.findAll();
    }

    public Optional<Verification> getVerificationById(
            Long id) {

        return verificationRepository.findById(id);
    }

    public Verification updateVerification(
            Long id,
            Verification verification) {

        Verification existingVerification =
                verificationRepository.findById(id)
                        .orElseThrow(() ->
                                new ResourceNotFoundException(
                                        "Verification not found"
                                ));

        Long applicationId =
                verification.getApplication().getId();

        Application application =
                applicationRepository.findById(applicationId)
                        .orElseThrow(() ->
                                new ResourceNotFoundException(
                                        "Application not found"
                                ));

        existingVerification.setApplication(application);

        existingVerification.setStatus(
                verification.getStatus()
        );

        existingVerification.setRemarks(
                verification.getRemarks()
        );

        return verificationRepository.save(
                existingVerification
        );
    }
}