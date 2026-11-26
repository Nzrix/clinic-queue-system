package com.clinic.queue.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import lombok.Data;

@Data
public class PatientRequest {
    @NotBlank(message = "Name is required")
    private String name;
    
    @NotBlank(message = "Phone is required")
    @Pattern(regexp = "^[0-9]{9,10}$", message = "Phone number must be 9-10 digits")
    private String phone;
    
    private String notes;
}
