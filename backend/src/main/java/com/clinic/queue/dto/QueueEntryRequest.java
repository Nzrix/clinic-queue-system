package com.clinic.queue.dto;

import jakarta.validation.constraints.NotNull;
import lombok.Data;

@Data
public class QueueEntryRequest {
    @NotNull(message = "Patient ID is required")
    private Long patientId;
    
    private String notes;
}
