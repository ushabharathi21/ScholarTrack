package com.example.scholartrack.service;

import com.example.scholartrack.exception.ResourceNotFoundException;
import com.example.scholartrack.entity.Scheme;
import com.example.scholartrack.repository.SchemeRepository;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class SchemeService {

    private final SchemeRepository schemeRepository;

    public SchemeService(SchemeRepository schemeRepository) {
        this.schemeRepository = schemeRepository;
    }

    public Scheme createScheme(Scheme scheme) {
        return schemeRepository.save(scheme);
    }

    public List<Scheme> getAllSchemes() {
        return schemeRepository.findAll();
    }

    public Optional<Scheme> getSchemeById(Long id) {
        return schemeRepository.findById(id);
    }

    public Scheme updateScheme(Long id, Scheme scheme) {

        Scheme existingScheme = schemeRepository.findById(id)
                .orElseThrow(() ->
                        new ResourceNotFoundException("Scheme not found"));

        existingScheme.setName(scheme.getName());
        existingScheme.setDescription(scheme.getDescription());
        existingScheme.setMaxIncome(scheme.getMaxIncome());
        existingScheme.setMinimumMarks(scheme.getMinimumMarks());
        existingScheme.setAmount(scheme.getAmount());

        return schemeRepository.save(existingScheme);
    }

    public void deleteScheme(Long id) {

        if (!schemeRepository.existsById(id)) {
            throw new ResourceNotFoundException("Scheme not found");
        }

        schemeRepository.deleteById(id);
    }
}