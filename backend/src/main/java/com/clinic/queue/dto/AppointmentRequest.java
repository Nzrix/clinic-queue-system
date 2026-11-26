package com.clinic.queue.dto;

import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

import java.time.LocalDateTime;

@Data
public class AppointmentRequest {
    @NotNull(message = "Patient ID is required")
    private Long patientId;
    
    @NotNull(message = "Appointment time is required")
    private LocalDateTime appointmentTime;
    
    @Min(value = 15, message = "Duration must be at least 15 minutes")
    private Integer durationMinutes = 30;
    
    private String notes;
}
