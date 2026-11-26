package com.clinic.queue.service;

import com.clinic.queue.dto.QueueEntryRequest;
import com.clinic.queue.dto.QueueEntryResponse;
import com.clinic.queue.entity.Patient;
import com.clinic.queue.entity.QueueEntry;
import com.clinic.queue.exception.BusinessException;
import com.clinic.queue.repository.PatientRepository;
import com.clinic.queue.repository.QueueEntryRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.time.LocalDateTime;
import java.util.Arrays;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class QueueServiceTest {
    
    @Mock
    private QueueEntryRepository queueRepository;
    
    @Mock
    private PatientRepository patientRepository;
    
    @InjectMocks
    private QueueService queueService;
    
    private Patient testPatient;
    
    @BeforeEach
    void setUp() {
        testPatient = new Patient();
        testPatient.setId(1L);
        testPatient.setName("Test Patient");
        testPatient.setPhone("0812345678");
    }
    
    @Test
    void createQueueEntry_GeneratesCorrectNumber() {
        when(patientRepository.findById(1L)).thenReturn(Optional.of(testPatient));
        when(queueRepository.findLatestQueueNumber(any(), any())).thenReturn(Arrays.asList());
        
        QueueEntry savedEntry = new QueueEntry();
        savedEntry.setId(1L);
        savedEntry.setPatient(testPatient);
        savedEntry.setQueueNumber("Q001");
        savedEntry.setStatus(QueueEntry.QueueStatus.WAITING);
        savedEntry.setQueueDate(LocalDateTime.now());
        
        when(queueRepository.save(any(QueueEntry.class))).thenReturn(savedEntry);
        
        QueueEntryRequest request = new QueueEntryRequest();
        request.setPatientId(1L);
        
        QueueEntryResponse response = queueService.createQueueEntry(request);
        
        assertNotNull(response);
        assertEquals("Q001", response.getQueueNumber());
        assertEquals("WAITING", response.getStatus());
    }
    
    @Test
    void callNext_UpdatesStatusToCalled() {
        QueueEntry waitingEntry = new QueueEntry();
        waitingEntry.setId(1L);
        waitingEntry.setPatient(testPatient);
        waitingEntry.setQueueNumber("Q001");
        waitingEntry.setStatus(QueueEntry.QueueStatus.WAITING);
        waitingEntry.setQueueDate(LocalDateTime.now());
        
        when(queueRepository.findNextWaitingQueue(any(), any())).thenReturn(Optional.of(waitingEntry));
        when(queueRepository.save(any(QueueEntry.class))).thenReturn(waitingEntry);
        
        QueueEntryResponse response = queueService.callNext();
        
        assertNotNull(response);
        verify(queueRepository).save(argThat(entry -> 
            entry.getStatus() == QueueEntry.QueueStatus.CALLED && entry.getCalledAt() != null
        ));
    }
    
    @Test
    void callNext_NoWaitingQueue_ThrowsException() {
        when(queueRepository.findNextWaitingQueue(any(), any())).thenReturn(Optional.empty());
        
        BusinessException exception = assertThrows(BusinessException.class, () -> {
            queueService.callNext();
        });
        
        assertEquals("No waiting queue entries found", exception.getMessage());
    }
    
    @Test
    void updateQueueStatus_ToInService_SetsStartedAt() {
        QueueEntry entry = new QueueEntry();
        entry.setId(1L);
        entry.setPatient(testPatient);
        entry.setStatus(QueueEntry.QueueStatus.CALLED);
        
        when(queueRepository.findById(1L)).thenReturn(Optional.of(entry));
        when(queueRepository.save(any(QueueEntry.class))).thenReturn(entry);
        
        QueueEntryResponse response = queueService.updateQueueStatus(1L, "IN_SERVICE");
        
        verify(queueRepository).save(argThat(savedEntry -> 
            savedEntry.getStatus() == QueueEntry.QueueStatus.IN_SERVICE && 
            savedEntry.getStartedAt() != null
        ));
    }
}
