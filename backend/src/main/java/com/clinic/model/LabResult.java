package com.clinic.model;

import jakarta.persistence.*;
import java.util.UUID;

@Entity
@Table(name = "lab_results")
public class LabResult {

    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private UUID id;

    @ManyToOne
    @JoinColumn(name = "lab_order_id", nullable = false)
    private LabOrder labOrder;

    @Column(nullable = false)
    private String testName; // Specific test name from the order (e.g. "Hemoglobin" from CBC)

    @Column(nullable = false)
    private String resultValue;

    @Column
    private String unit;

    @Column
    private String referenceRange;

    @Column(nullable = false)
    private boolean isAbnormal;

    @Column(columnDefinition = "TEXT")
    private String remarks;

    public LabResult() {
    }

    public LabResult(UUID id, LabOrder labOrder, String testName, String resultValue, String unit,
            String referenceRange, boolean isAbnormal, String remarks) {
        this.id = id;
        this.labOrder = labOrder;
        this.testName = testName;
        this.resultValue = resultValue;
        this.unit = unit;
        this.referenceRange = referenceRange;
        this.isAbnormal = isAbnormal;
        this.remarks = remarks;
    }

    public UUID getId() {
        return id;
    }

    public void setId(UUID id) {
        this.id = id;
    }

    public LabOrder getLabOrder() {
        return labOrder;
    }

    public void setLabOrder(LabOrder labOrder) {
        this.labOrder = labOrder;
    }

    public String getTestName() {
        return testName;
    }

    public void setTestName(String testName) {
        this.testName = testName;
    }

    public String getResultValue() {
        return resultValue;
    }

    public void setResultValue(String resultValue) {
        this.resultValue = resultValue;
    }

    public String getUnit() {
        return unit;
    }

    public void setUnit(String unit) {
        this.unit = unit;
    }

    public String getReferenceRange() {
        return referenceRange;
    }

    public void setReferenceRange(String referenceRange) {
        this.referenceRange = referenceRange;
    }

    public boolean isAbnormal() {
        return isAbnormal;
    }

    public void setAbnormal(boolean abnormal) {
        isAbnormal = abnormal;
    }

    public String getRemarks() {
        return remarks;
    }

    public void setRemarks(String remarks) {
        this.remarks = remarks;
    }
}
