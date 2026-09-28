package com.example.scholartrack.service;

import com.example.scholartrack.entity.Application;
import com.example.scholartrack.entity.Student;
import com.example.scholartrack.entity.Scheme;
import com.example.scholartrack.repository.ApplicationRepository;
import com.example.scholartrack.repository.StudentRepository;
import com.example.scholartrack.repository.SchemeRepository;
import com.example.scholartrack.repository.VerificationRepository;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class ApplicationService {

    private final ApplicationRepository applicationRepository;
    private final StudentRepository studentRepository;
    private final SchemeRepository schemeRepository;
    private final VerificationRepository verificationRepository;

    public ApplicationService(
            ApplicationRepository applicationRepository,
            StudentRepository studentRepository,
            SchemeRepository schemeRepository,
            VerificationRepository verificationRepository) {

        this.applicationRepository = applicationRepository;
        this.studentRepository = studentRepository;
        this.schemeRepository = schemeRepository;
        this.verificationRepository = verificationRepository;
    }

    // CREATE APPLICATION
    public Application createApplication(Application application) {

        Long studentId = application.getStudent().getId();
        Long schemeId = application.getScheme().getId();

        Student student = studentRepository.findById(studentId)
                .orElseThrow(() ->
                        new RuntimeException("Student not found"));

        Scheme scheme = schemeRepository.findById(schemeId)
                .orElseThrow(() ->
                        new RuntimeException("Scheme not found"));

        application.setStudent(student);
        application.setScheme(scheme);

        boolean incomeEligible =
                student.getIncome() <= scheme.getMaxIncome();

        boolean marksEligible =
                student.getMarks() >= scheme.getMinimumMarks();

        if (incomeEligible && marksEligible) {

            application.setStatus("ELIGIBLE");

            application.setRemarks(
                    "Student satisfies income and marks eligibility criteria"
            );

        } else {

            application.setStatus("ELIGIBILITY_FAILED");

            if (!incomeEligible && !marksEligible) {

                application.setRemarks(
                        "Student does not satisfy income and marks criteria"
                );

            } else if (!incomeEligible) {

                application.setRemarks(
                        "Student income exceeds the maximum income limit"
                );

            } else {

                application.setRemarks(
                        "Student marks are below the minimum marks requirement"
                );
            }
        }

        return applicationRepository.save(application);
    }

    // GET ALL APPLICATIONS
    public List<Application> getAllApplications() {
        return applicationRepository.findAll();
    }

    // GET APPLICATION BY ID
    public Optional<Application> getApplicationById(Long id) {
        return applicationRepository.findById(id);
    }

    // UPDATE APPLICATION
    public Application updateApplication(
            Long id,
            Application application) {

        Application existingApplication =
                applicationRepository.findById(id)
                        .orElseThrow(() ->
                                new RuntimeException("Application not found"));

        existingApplication.setStudent(
                application.getStudent()
        );

        existingApplication.setScheme(
                application.getScheme()
        );

        existingApplication.setApplicationDate(
                application.getApplicationDate()
        );

        existingApplication.setStatus(
                application.getStatus()
        );

        String newDisbursementStatus =
                application.getDisbursementStatus();

        // CHECK VERIFICATION BEFORE COMPLETING DISBURSEMENT
        if ("COMPLETED".equalsIgnoreCase(newDisbursementStatus)) {

            Optional<com.example.scholartrack.entity.Verification> verification =
                    verificationRepository.findByApplicationId(id);

            if (verification.isEmpty()) {

                throw new RuntimeException(
                        "Disbursement cannot be completed because verification is not available"
                );
            }

            if (!"APPROVED".equalsIgnoreCase(
                    verification.get().getStatus())) {

                throw new RuntimeException(
                        "Disbursement cannot be completed until verification is APPROVED"
                );
            }
        }

        existingApplication.setDisbursementStatus(
                newDisbursementStatus
        );

        existingApplication.setRemarks(
                application.getRemarks()
        );

        return applicationRepository.save(existingApplication);
    }

    // DELETE APPLICATION
    public void deleteApplication(Long id) {

        if (!applicationRepository.existsById(id)) {

            throw new RuntimeException(
                    "Application not found"
            );
        }

        applicationRepository.deleteById(id);
    }
}