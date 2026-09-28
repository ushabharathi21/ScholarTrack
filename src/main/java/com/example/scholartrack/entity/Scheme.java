package com.example.scholartrack.entity;

import jakarta.persistence.*;
import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

@Entity
@Table(name = "schemes")
public class Scheme {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotBlank(message = "Scheme name is required")
    private String name;

    @NotBlank(message = "Description is required")
    private String description;

    @NotNull(message = "Maximum income is required")
    @DecimalMin(value = "0.0", message = "Maximum income cannot be negative")
    private Double maxIncome;

    @NotNull(message = "Minimum marks are required")
    @DecimalMin(value = "0.0", message = "Minimum marks cannot be negative")
    private Double minimumMarks;

    @NotNull(message = "Scholarship amount is required")
    @DecimalMin(value = "0.0", message = "Scholarship amount cannot be negative")
    private Double amount;

    public Scheme() {
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public Double getMaxIncome() {
        return maxIncome;
    }

    public void setMaxIncome(Double maxIncome) {
        this.maxIncome = maxIncome;
    }

    public Double getMinimumMarks() {
        return minimumMarks;
    }

    public void setMinimumMarks(Double minimumMarks) {
        this.minimumMarks = minimumMarks;
    }

    public Double getAmount() {
        return amount;
    }

    public void setAmount(Double amount) {
        this.amount = amount;
    }
}