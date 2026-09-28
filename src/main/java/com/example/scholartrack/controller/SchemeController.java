package com.example.scholartrack.controller;

import com.example.scholartrack.entity.Scheme;
import com.example.scholartrack.service.SchemeService;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/schemes")
public class SchemeController {

    private final SchemeService schemeService;

    public SchemeController(SchemeService schemeService) {
        this.schemeService = schemeService;
    }

    // CREATE SCHEME
    @PostMapping
    public Scheme createScheme(
            @Valid @RequestBody Scheme scheme) {

        return schemeService.createScheme(scheme);
    }

    // GET ALL SCHEMES
    @GetMapping
    public List<Scheme> getAllSchemes() {
        return schemeService.getAllSchemes();
    }

    // GET SCHEME BY ID
    @GetMapping("/{id}")
    public ResponseEntity<Scheme> getSchemeById(
            @PathVariable Long id) {

        return schemeService.getSchemeById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    // UPDATE SCHEME
    @PutMapping("/{id}")
    public Scheme updateScheme(
            @PathVariable Long id,
            @Valid @RequestBody Scheme scheme) {

        return schemeService.updateScheme(id, scheme);
    }

    // DELETE SCHEME
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteScheme(
            @PathVariable Long id) {

        schemeService.deleteScheme(id);

        return ResponseEntity.noContent().build();
    }
}