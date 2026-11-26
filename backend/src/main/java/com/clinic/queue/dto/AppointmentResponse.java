package com.clinic.queue.dto;

import com.clinic.queue.entity.Appointment;
import lombok.Data;

import java.time.LocalDateTime;

@Data
public class AppointmentResponse {
    private Long id;
    private Long patientId;
    private String patientName;
    private String patientPhone;
    private LocalDateTime appointmentTime;
    private Integer durationMinutes;
    private String status;
    private String notes;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
    
    public static AppointmentResponse fromEntity(Appointment appointment) {
        AppointmentResponse response = new AppointmentResponse();
        response.setId(appointment.getId());
        response.setPatientId(appointment.getPatient().getId());
        response.setPatientName(appointment.getPatient().getName());
        response.setPatientPhone(appointment.getPatient().getPhone());
        response.setAppointmentTime(appointment.getAppointmentTime());
        response.setDurationMinutes(appointment.getDurationMinutes());
        response.setStatus(appointment.getStatus().name());
        response.setNotes(appointment.getNotes());
        response.setCreatedAt(appointment.getCreatedAt());
        response.setUpdatedAt(appointment.getUpdatedAt());
        return response;
    }
}
