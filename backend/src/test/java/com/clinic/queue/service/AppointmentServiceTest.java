package com.clinic.queue.service;

import com.clinic.queue.dto.AppointmentRequest;
import com.clinic.queue.dto.AppointmentResponse;
import com.clinic.queue.entity.Appointment;
import com.clinic.queue.entity.Patient;
import com.clinic.queue.exception.BusinessException;
import com.clinic.queue.repository.AppointmentRepository;
import com.clinic.queue.repository.PatientRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.time.LocalDateTime;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class AppointmentServiceTest {
    
    @Mock
    private AppointmentRepository appointmentRepository;
    
    @Mock
    private PatientRepository patientRepository;
    
    @InjectMocks
    private AppointmentService appointmentService;
    
    private Patient testPatient;
    private AppointmentRequest request;
    
    @BeforeEach
    void setUp() {
        testPatient = new Patient();
        testPatient.setId(1L);
        testPatient.setName("Test Patient");
        testPatient.setPhone("0812345678");
        
        request = new AppointmentRequest();
        request.setPatientId(1L);
        request.setAppointmentTime(LocalDateTime.of(2024, 1, 15, 10, 0));
        request.setDurationMinutes(30);
    }
    
    @Test
    void createAppointment_Success() {
        when(patientRepository.findById(1L)).thenReturn(Optional.of(testPatient));
        when(appointmentRepository.hasConflictingAppointment(any(), any(), eq(null))).thenReturn(false);
        
        Appointment savedAppointment = new Appointment();
        savedAppointment.setId(1L);
        savedAppointment.setPatient(testPatient);
        savedAppointment.setAppointmentTime(request.getAppointmentTime());
        savedAppointment.setDurationMinutes(30);
        savedAppointment.setStatus(Appointment.AppointmentStatus.SCHEDULED);
        
        when(appointmentRepository.save(any(Appointment.class))).thenReturn(savedAppointment);
        
        AppointmentResponse response = appointmentService.createAppointment(request);
        
        assertNotNull(response);
        assertEquals(1L, response.getId());
        verify(appointmentRepository).hasConflictingAppointment(any(), any(), eq(null));
        verify(appointmentRepository).save(any(Appointment.class));
    }
    
    @Test
    void createAppointment_DoubleBooking_ThrowsException() {
        when(patientRepository.findById(1L)).thenReturn(Optional.of(testPatient));
        when(appointmentRepository.hasConflictingAppointment(any(), any(), eq(null))).thenReturn(true);
        
        BusinessException exception = assertThrows(BusinessException.class, () -> {
            appointmentService.createAppointment(request);
        });
        
        assertEquals("Time slot is already booked. Please choose another time.", exception.getMessage());
        verify(appointmentRepository, never()).save(any());
    }
    
    @Test
    void updateAppointment_WithConflict_ThrowsException() {
        Appointment existingAppointment = new Appointment();
        existingAppointment.setId(1L);
        existingAppointment.setPatient(testPatient);
        
        when(appointmentRepository.findById(1L)).thenReturn(Optional.of(existingAppointment));
        when(patientRepository.findById(1L)).thenReturn(Optional.of(testPatient));
        when(appointmentRepository.hasConflictingAppointment(any(), any(), eq(1L))).thenReturn(true);
        
        BusinessException exception = assertThrows(BusinessException.class, () -> {
            appointmentService.updateAppointment(1L, request);
        });
        
        assertEquals("Time slot is already booked. Please choose another time.", exception.getMessage());
    }
}
