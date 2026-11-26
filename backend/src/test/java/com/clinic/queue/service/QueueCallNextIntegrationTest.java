package com.clinic.queue.service;

import com.clinic.queue.dto.QueueEntryRequest;
import com.clinic.queue.dto.QueueEntryResponse;
import com.clinic.queue.entity.Patient;
import com.clinic.queue.repository.PatientRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.transaction.annotation.Transactional;

import static org.junit.jupiter.api.Assertions.*;

/**
 * Regression: callNext must pick the earliest WAITING entry when several exist
 * (Optional query returning multiple rows previously threw NonUniqueResultException).
 */
@SpringBootTest
@ActiveProfiles("test")
@Transactional
public class QueueCallNextIntegrationTest {

    @Autowired
    private QueueService queueService;

    @Autowired
    private PatientRepository patientRepository;

    private Long patientA;
    private Long patientB;

    @BeforeEach
    void setUp() {
        Patient a = new Patient();
        a.setName("Queue A");
        a.setPhone("0800000011");
        a.setActive(true);
        patientA = patientRepository.save(a).getId();

        Patient b = new Patient();
        b.setName("Queue B");
        b.setPhone("0800000012");
        b.setActive(true);
        patientB = patientRepository.save(b).getId();
    }

    @Test
    void callNext_withMultipleWaiting_returnsFirstWithoutError() {
        QueueEntryRequest first = new QueueEntryRequest();
        first.setPatientId(patientA);
        QueueEntryResponse q1 = queueService.createQueueEntry(first);

        QueueEntryRequest second = new QueueEntryRequest();
        second.setPatientId(patientB);
        queueService.createQueueEntry(second);

        QueueEntryResponse called = assertDoesNotThrow(() -> queueService.callNext());
        assertEquals("CALLED", called.getStatus());
        assertEquals(q1.getQueueNumber(), called.getQueueNumber());
    }
}
