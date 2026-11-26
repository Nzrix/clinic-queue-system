package com.clinic.queue.service;

import com.clinic.queue.dto.AppointmentRequest;
import com.clinic.queue.dto.AppointmentResponse;
import com.clinic.queue.entity.Appointment;
import com.clinic.queue.entity.Patient;
import com.clinic.queue.exception.BusinessException;
import com.clinic.queue.exception.ResourceNotFoundException;
import com.clinic.queue.repository.AppointmentRepository;
import com.clinic.queue.repository.PatientRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;
import java.time.ZoneId;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class AppointmentService {
    
    private final AppointmentRepository appointmentRepository;
    private final PatientRepository patientRepository;
    private static final ZoneId BANGKOK_ZONE = ZoneId.of("Asia/Bangkok");
    
    @Transactional(readOnly = true)
    public List<AppointmentResponse> getAppointmentsByDateRange(LocalDate startDate, LocalDate endDate) {
        LocalDateTime start = startDate.atStartOfDay();
        LocalDateTime end = endDate.atTime(LocalTime.MAX);
        
        List<Appointment> appointments = appointmentRepository.findAppointmentsBetween(start, end);
        return appointments.stream()
            .map(AppointmentResponse::fromEntity)
            .collect(Collectors.toList());
    }
    
    @Transactional(readOnly = true)
    public AppointmentResponse getAppointmentById(Long id) {
        Appointment appointment = appointmentRepository.findById(id)
            .orElseThrow(() -> new ResourceNotFoundException("Appointment not found with id: " + id));
        return AppointmentResponse.fromEntity(appointment);
    }
    
    @Transactional
    public AppointmentResponse createAppointment(AppointmentRequest request) {
        Patient patient = patientRepository.findById(request.getPatientId())
            .orElseThrow(() -> new ResourceNotFoundException("Patient not found with id: " + request.getPatientId()));
        
        LocalDateTime endTime = request.getAppointmentTime().plusMinutes(request.getDurationMinutes());
        
        if (appointmentRepository.hasConflictingAppointment(request.getAppointmentTime(), endTime, null)) {
            throw new BusinessException("Time slot is already booked. Please choose another time.");
        }
        
        Appointment appointment = new Appointment();
        appointment.setPatient(patient);
        appointment.setAppointmentTime(request.getAppointmentTime());
        appointment.setDurationMinutes(request.getDurationMinutes());
        appointment.setStatus(Appointment.AppointmentStatus.SCHEDULED);
        appointment.setNotes(request.getNotes());
        
        Appointment savedAppointment = appointmentRepository.save(appointment);
        return AppointmentResponse.fromEntity(savedAppointment);
    }
    
    @Transactional
    public AppointmentResponse updateAppointment(Long id, AppointmentRequest request) {
        Appointment appointment = appointmentRepository.findById(id)
            .orElseThrow(() -> new ResourceNotFoundException("Appointment not found with id: " + id));
        
        Patient patient = patientRepository.findById(request.getPatientId())
            .orElseThrow(() -> new ResourceNotFoundException("Patient not found with id: " + request.getPatientId()));
        
        LocalDateTime endTime = request.getAppointmentTime().plusMinutes(request.getDurationMinutes());
        
        if (appointmentRepository.hasConflictingAppointment(request.getAppointmentTime(), endTime, id)) {
            throw new BusinessException("Time slot is already booked. Please choose another time.");
        }
        
        appointment.setPatient(patient);
        appointment.setAppointmentTime(request.getAppointmentTime());
        appointment.setDurationMinutes(request.getDurationMinutes());
        appointment.setNotes(request.getNotes());
        
        Appointment updatedAppointment = appointmentRepository.save(appointment);
        return AppointmentResponse.fromEntity(updatedAppointment);
    }
    
    @Transactional
    public AppointmentResponse updateAppointmentStatus(Long id, String status) {
        Appointment appointment = appointmentRepository.findById(id)
            .orElseThrow(() -> new ResourceNotFoundException("Appointment not found with id: " + id));
        
        try {
            appointment.setStatus(Appointment.AppointmentStatus.valueOf(status));
        } catch (IllegalArgumentException e) {
            throw new BusinessException("Invalid status: " + status);
        }
        
        Appointment updatedAppointment = appointmentRepository.save(appointment);
        return AppointmentResponse.fromEntity(updatedAppointment);
    }
    
    @Transactional
    public void deleteAppointment(Long id) {
        Appointment appointment = appointmentRepository.findById(id)
            .orElseThrow(() -> new ResourceNotFoundException("Appointment not found with id: " + id));
        
        appointment.setStatus(Appointment.AppointmentStatus.CANCELLED);
        appointmentRepository.save(appointment);
    }
}
