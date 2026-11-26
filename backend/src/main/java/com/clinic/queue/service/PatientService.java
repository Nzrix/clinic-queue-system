package com.clinic.queue.service;

import com.clinic.queue.dto.PatientRequest;
import com.clinic.queue.dto.PatientResponse;
import com.clinic.queue.entity.Patient;
import com.clinic.queue.exception.ResourceNotFoundException;
import com.clinic.queue.repository.PatientRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class PatientService {
    
    private final PatientRepository patientRepository;
    
    @Transactional(readOnly = true)
    public Page<PatientResponse> getAllPatients(String search, Pageable pageable) {
        Page<Patient> patients;
        
        if (search != null && !search.isBlank()) {
            patients = patientRepository.searchActivePatients(search, pageable);
        } else {
            patients = patientRepository.findByActiveTrue(pageable);
        }
        
        return patients.map(PatientResponse::fromEntity);
    }
    
    @Transactional(readOnly = true)
    public PatientResponse getPatientById(Long id) {
        Patient patient = patientRepository.findById(id)
            .orElseThrow(() -> new ResourceNotFoundException("Patient not found with id: " + id));
        return PatientResponse.fromEntity(patient);
    }
    
    @Transactional
    public PatientResponse createPatient(PatientRequest request) {
        Patient patient = new Patient();
        patient.setName(request.getName());
        patient.setPhone(request.getPhone());
        patient.setNotes(request.getNotes());
        patient.setActive(true);
        
        Patient savedPatient = patientRepository.save(patient);
        return PatientResponse.fromEntity(savedPatient);
    }
    
    @Transactional
    public PatientResponse updatePatient(Long id, PatientRequest request) {
        Patient patient = patientRepository.findById(id)
            .orElseThrow(() -> new ResourceNotFoundException("Patient not found with id: " + id));
        
        patient.setName(request.getName());
        patient.setPhone(request.getPhone());
        patient.setNotes(request.getNotes());
        
        Patient updatedPatient = patientRepository.save(patient);
        return PatientResponse.fromEntity(updatedPatient);
    }
    
    @Transactional
    public void deletePatient(Long id) {
        Patient patient = patientRepository.findById(id)
            .orElseThrow(() -> new ResourceNotFoundException("Patient not found with id: " + id));
        
        patient.setActive(false);
        patientRepository.save(patient);
    }
}
