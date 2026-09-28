package com.example.scholartrack.controller;

import com.example.scholartrack.entity.Application;
import com.example.scholartrack.service.ApplicationService;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/applications")
public class ApplicationController {

    private final ApplicationService applicationService;

    public ApplicationController(ApplicationService applicationService) {
        this.applicationService = applicationService;
    }

    // CREATE APPLICATION
    @PostMapping
    public Application createApplication(
            @Valid @RequestBody Application application) {

        return applicationService.createApplication(application);
    }

    // GET ALL APPLICATIONS
    @GetMapping
    public List<Application> getAllApplications() {
        return applicationService.getAllApplications();
    }

    // GET APPLICATION BY ID
    @GetMapping("/{id}")
    public ResponseEntity<Application> getApplicationById(
            @PathVariable Long id) {

        return applicationService.getApplicationById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    // UPDATE APPLICATION
    @PutMapping("/{id}")
    public Application updateApplication(
            @PathVariable Long id,
            @Valid @RequestBody Application application) {

        return applicationService.updateApplication(id, application);
    }

    // DELETE APPLICATION
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteApplication(
            @PathVariable Long id) {

        applicationService.deleteApplication(id);

        return ResponseEntity.noContent().build();
    }
}