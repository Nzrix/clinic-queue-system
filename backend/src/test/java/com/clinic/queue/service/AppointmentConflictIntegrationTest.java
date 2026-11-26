package com.clinic.queue.service;

import com.clinic.queue.dto.AppointmentRequest;
import com.clinic.queue.entity.Patient;
import com.clinic.queue.exception.BusinessException;
import com.clinic.queue.repository.PatientRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;

import static org.junit.jupiter.api.Assertions.*;

/**
 * Regression: native conflict query must not ClassCastException Integer→Boolean
 * (MySQL COUNT/CASE returns numeric types).
 */
@SpringBootTest
@ActiveProfiles("test")
@Transactional
public class AppointmentConflictIntegrationTest {

    @Autowired
    private AppointmentService appointmentService;

    @Autowired
    private PatientRepository patientRepository;

    private Long patientId;

    @BeforeEach
    void setUp() {
        Patient patient = new Patient();
        patient.setName("Conflict Test");
        patient.setPhone("0800000001");
        patient.setActive(true);
        patientId = patientRepository.save(patient).getId();
    }

    @Test
    void createAppointment_thenConflict_rejectsWithoutCastError() {
        LocalDateTime slot = LocalDateTime.of(2030, 6, 1, 10, 0);

        AppointmentRequest first = new AppointmentRequest();
        first.setPatientId(patientId);
        first.setAppointmentTime(slot);
        first.setDurationMinutes(30);
        first.setNotes("first");

        assertDoesNotThrow(() -> appointmentService.createAppointment(first));

        AppointmentRequest conflict = new AppointmentRequest();
        conflict.setPatientId(patientId);
        conflict.setAppointmentTime(slot);
        conflict.setDurationMinutes(30);
        conflict.setNotes("overlap");

        BusinessException ex = assertThrows(BusinessException.class,
            () -> appointmentService.createAppointment(conflict));
        assertTrue(ex.getMessage().toLowerCase().contains("booked"));
    }
}
