package com.clinic.queue.repository;

import com.clinic.queue.entity.Appointment;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;

@Repository
public interface AppointmentRepository extends JpaRepository<Appointment, Long> {
    
    @Query("SELECT a FROM Appointment a " +
           "JOIN FETCH a.patient " +
           "WHERE a.appointmentTime >= :start AND a.appointmentTime < :end " +
           "ORDER BY a.appointmentTime")
    List<Appointment> findAppointmentsBetween(
        @Param("start") LocalDateTime start, 
        @Param("end") LocalDateTime end
    );
    
    @Query("SELECT a FROM Appointment a " +
           "JOIN FETCH a.patient " +
           "WHERE a.appointmentTime >= :start AND a.appointmentTime < :end " +
           "AND a.status = :status " +
           "ORDER BY a.appointmentTime")
    List<Appointment> findAppointmentsBetweenAndStatus(
        @Param("start") LocalDateTime start,
        @Param("end") LocalDateTime end,
        @Param("status") Appointment.AppointmentStatus status
    );
    
    @Query(value = "SELECT CASE WHEN COUNT(*) > 0 THEN true ELSE false END FROM appointments a " +
           "WHERE a.status = 'SCHEDULED' " +
           "AND ((a.appointment_time <= :startTime AND :startTime < DATE_ADD(a.appointment_time, INTERVAL a.duration_minutes MINUTE)) " +
           "OR (:startTime <= a.appointment_time AND a.appointment_time < :endTime)) " +
           "AND (:excludeId IS NULL OR a.id <> :excludeId)", nativeQuery = true)
    boolean hasConflictingAppointment(
        @Param("startTime") LocalDateTime startTime,
        @Param("endTime") LocalDateTime endTime,
        @Param("excludeId") Long excludeId
    );
    
    Page<Appointment> findByPatientIdOrderByAppointmentTimeDesc(Long patientId, Pageable pageable);
    
    @Query("SELECT a FROM Appointment a " +
           "WHERE a.appointmentTime >= :start AND a.appointmentTime < :end " +
           "AND a.status IN :statuses")
    List<Appointment> countByDateRangeAndStatuses(
        @Param("start") LocalDateTime start,
        @Param("end") LocalDateTime end,
        @Param("statuses") List<Appointment.AppointmentStatus> statuses
    );
}
