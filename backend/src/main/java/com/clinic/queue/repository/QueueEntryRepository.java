package com.clinic.queue.repository;

import com.clinic.queue.entity.QueueEntry;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Repository
public interface QueueEntryRepository extends JpaRepository<QueueEntry, Long> {
    
    @Query("SELECT q FROM QueueEntry q " +
           "JOIN FETCH q.patient " +
           "WHERE q.queueDate >= :start AND q.queueDate < :end " +
           "ORDER BY q.createdAt")
    List<QueueEntry> findQueueEntriesByDate(
        @Param("start") LocalDateTime start,
        @Param("end") LocalDateTime end
    );
    
    @Query("SELECT q FROM QueueEntry q " +
           "JOIN FETCH q.patient " +
           "WHERE q.queueDate >= :start AND q.queueDate < :end " +
           "AND q.status = :status " +
           "ORDER BY q.createdAt")
    List<QueueEntry> findQueueEntriesByDateAndStatus(
        @Param("start") LocalDateTime start,
        @Param("end") LocalDateTime end,
        @Param("status") QueueEntry.QueueStatus status
    );
    
    @Query("SELECT q FROM QueueEntry q " +
           "WHERE q.queueDate >= :start AND q.queueDate < :end " +
           "ORDER BY q.queueNumber DESC")
    List<QueueEntry> findLatestQueueNumber(
        @Param("start") LocalDateTime start,
        @Param("end") LocalDateTime end
    );
    
    @Query("SELECT q FROM QueueEntry q " +
           "WHERE q.queueDate >= :start AND q.queueDate < :end " +
           "AND q.status = 'WAITING' " +
           "ORDER BY q.createdAt")
    Optional<QueueEntry> findNextWaitingQueue(
        @Param("start") LocalDateTime start,
        @Param("end") LocalDateTime end
    );
}
