package com.clinic.queue.dto;

import com.clinic.queue.entity.Patient;
import lombok.Data;

import java.time.LocalDateTime;

@Data
public class PatientResponse {
    private Long id;
    private String name;
    private String phone;
    private String notes;
    private Boolean active;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
    
    public static PatientResponse fromEntity(Patient patient) {
        PatientResponse response = new PatientResponse();
        response.setId(patient.getId());
        response.setName(patient.getName());
        response.setPhone(patient.getPhone());
        response.setNotes(patient.getNotes());
        response.setActive(patient.getActive());
        response.setCreatedAt(patient.getCreatedAt());
        response.setUpdatedAt(patient.getUpdatedAt());
        return response;
    }
}
