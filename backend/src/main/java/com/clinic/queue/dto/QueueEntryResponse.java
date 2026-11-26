package com.clinic.queue.dto;

import com.clinic.queue.entity.QueueEntry;
import lombok.Data;

import java.time.LocalDateTime;

@Data
public class QueueEntryResponse {
    private Long id;
    private Long patientId;
    private String patientName;
    private String patientPhone;
    private String queueNumber;
    private LocalDateTime queueDate;
    private String status;
    private LocalDateTime calledAt;
    private LocalDateTime startedAt;
    private LocalDateTime completedAt;
    private String notes;
    private LocalDateTime createdAt;
    
    public static QueueEntryResponse fromEntity(QueueEntry entry) {
        QueueEntryResponse response = new QueueEntryResponse();
        response.setId(entry.getId());
        response.setPatientId(entry.getPatient().getId());
        response.setPatientName(entry.getPatient().getName());
        response.setPatientPhone(entry.getPatient().getPhone());
        response.setQueueNumber(entry.getQueueNumber());
        response.setQueueDate(entry.getQueueDate());
        response.setStatus(entry.getStatus().name());
        response.setCalledAt(entry.getCalledAt());
        response.setStartedAt(entry.getStartedAt());
        response.setCompletedAt(entry.getCompletedAt());
        response.setNotes(entry.getNotes());
        response.setCreatedAt(entry.getCreatedAt());
        return response;
    }
}
