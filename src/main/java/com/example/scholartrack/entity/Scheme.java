package com.example.scholartrack.entity;

import jakarta.persistence.*;

@Entity
@Table(name = "schemes")
public class Scheme {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String name;

    private String description;

    private Double maxIncome;

    private Double minimumMarks;

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