package com.clinic.queue.service;

import com.clinic.queue.dto.QueueEntryRequest;
import com.clinic.queue.dto.QueueEntryResponse;
import com.clinic.queue.entity.Patient;
import com.clinic.queue.entity.QueueEntry;
import com.clinic.queue.exception.BusinessException;
import com.clinic.queue.exception.ResourceNotFoundException;
import com.clinic.queue.repository.PatientRepository;
import com.clinic.queue.repository.QueueEntryRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;
import java.time.ZoneId;
import java.time.format.DateTimeFormatter;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class QueueService {
    
    private final QueueEntryRepository queueRepository;
    private final PatientRepository patientRepository;
    private static final ZoneId BANGKOK_ZONE = ZoneId.of("Asia/Bangkok");
    
    @Transactional(readOnly = true)
    public List<QueueEntryResponse> getTodayQueue() {
        LocalDate today = LocalDate.now(BANGKOK_ZONE);
        LocalDateTime start = today.atStartOfDay();
        LocalDateTime end = today.atTime(LocalTime.MAX);
        
        List<QueueEntry> entries = queueRepository.findQueueEntriesByDate(start, end);
        return entries.stream()
            .map(QueueEntryResponse::fromEntity)
            .collect(Collectors.toList());
    }
    
    @Transactional(readOnly = true)
    public List<QueueEntryResponse> getQueueByDate(LocalDate date) {
        LocalDateTime start = date.atStartOfDay();
        LocalDateTime end = date.atTime(LocalTime.MAX);
        
        List<QueueEntry> entries = queueRepository.findQueueEntriesByDate(start, end);
        return entries.stream()
            .map(QueueEntryResponse::fromEntity)
            .collect(Collectors.toList());
    }
    
    @Transactional
    public QueueEntryResponse createQueueEntry(QueueEntryRequest request) {
        Patient patient = patientRepository.findById(request.getPatientId())
            .orElseThrow(() -> new ResourceNotFoundException("Patient not found with id: " + request.getPatientId()));
        
        LocalDateTime now = LocalDateTime.now(BANGKOK_ZONE);
        LocalDate today = now.toLocalDate();
        
        String queueNumber = generateQueueNumber(today);
        
        QueueEntry entry = new QueueEntry();
        entry.setPatient(patient);
        entry.setQueueNumber(queueNumber);
        entry.setQueueDate(now);
        entry.setStatus(QueueEntry.QueueStatus.WAITING);
        entry.setNotes(request.getNotes());
        
        QueueEntry savedEntry = queueRepository.save(entry);
        return QueueEntryResponse.fromEntity(savedEntry);
    }
    
    @Transactional
    public QueueEntryResponse callNext() {
        LocalDate today = LocalDate.now(BANGKOK_ZONE);
        LocalDateTime start = today.atStartOfDay();
        LocalDateTime end = today.atTime(LocalTime.MAX);
        
        QueueEntry entry = queueRepository.findNextWaitingQueue(start, end)
            .orElseThrow(() -> new BusinessException("No waiting queue entries found"));
        
        entry.setStatus(QueueEntry.QueueStatus.CALLED);
        entry.setCalledAt(LocalDateTime.now(BANGKOK_ZONE));
        
        QueueEntry updatedEntry = queueRepository.save(entry);
        return QueueEntryResponse.fromEntity(updatedEntry);
    }
    
    @Transactional
    public QueueEntryResponse updateQueueStatus(Long id, String status) {
        QueueEntry entry = queueRepository.findById(id)
            .orElseThrow(() -> new ResourceNotFoundException("Queue entry not found with id: " + id));
        
        QueueEntry.QueueStatus oldStatus = entry.getStatus();
        QueueEntry.QueueStatus newStatus;
        
        try {
            newStatus = QueueEntry.QueueStatus.valueOf(status);
        } catch (IllegalArgumentException e) {
            throw new BusinessException("Invalid status: " + status);
        }
        
        LocalDateTime now = LocalDateTime.now(BANGKOK_ZONE);
        entry.setStatus(newStatus);
        
        switch (newStatus) {
            case CALLED:
                if (entry.getCalledAt() == null) {
                    entry.setCalledAt(now);
                }
                break;
            case IN_SERVICE:
                if (entry.getStartedAt() == null) {
                    entry.setStartedAt(now);
                }
                break;
            case COMPLETED:
                if (entry.getCompletedAt() == null) {
                    entry.setCompletedAt(now);
                }
                break;
        }
        
        QueueEntry updatedEntry = queueRepository.save(entry);
        return QueueEntryResponse.fromEntity(updatedEntry);
    }
    
    private String generateQueueNumber(LocalDate date) {
        LocalDateTime start = date.atStartOfDay();
        LocalDateTime end = date.atTime(LocalTime.MAX);
        
        List<QueueEntry> entries = queueRepository.findLatestQueueNumber(start, end);
        
        int nextNumber = 1;
        if (!entries.isEmpty()) {
            String lastNumber = entries.get(0).getQueueNumber();
            String numberPart = lastNumber.substring(1);
            nextNumber = Integer.parseInt(numberPart) + 1;
        }
        
        return String.format("Q%03d", nextNumber);
    }
}
