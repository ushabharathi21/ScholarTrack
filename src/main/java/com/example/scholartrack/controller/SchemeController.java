package com.example.scholartrack.controller;

import com.example.scholartrack.entity.Scheme;
import com.example.scholartrack.service.SchemeService;
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

    @PostMapping
    public Scheme createScheme(@RequestBody Scheme scheme) {
        return schemeService.createScheme(scheme);
    }

    @GetMapping
    public List<Scheme> getAllSchemes() {
        return schemeService.getAllSchemes();
    }

    @GetMapping("/{id}")
    public ResponseEntity<Scheme> getSchemeById(@PathVariable Long id) {

        return schemeService.getSchemeById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PutMapping("/{id}")
    public Scheme updateScheme(
            @PathVariable Long id,
            @RequestBody Scheme scheme) {

        return schemeService.updateScheme(id, scheme);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteScheme(@PathVariable Long id) {

        schemeService.deleteScheme(id);

        return ResponseEntity.noContent().build();
    }
}