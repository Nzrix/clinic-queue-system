package com.clinic.queue.service;

import com.clinic.queue.dto.DashboardResponse;
import com.clinic.queue.entity.Appointment;
import com.clinic.queue.entity.QueueEntry;
import com.clinic.queue.repository.AppointmentRepository;
import com.clinic.queue.repository.QueueEntryRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.Duration;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;
import java.time.ZoneId;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class DashboardService {
    
    private final AppointmentRepository appointmentRepository;
    private final QueueEntryRepository queueRepository;
    private static final ZoneId BANGKOK_ZONE = ZoneId.of("Asia/Bangkok");
    
    @Transactional(readOnly = true)
    public DashboardResponse getDashboardData() {
        LocalDate today = LocalDate.now(BANGKOK_ZONE);
        
        DashboardResponse.TodayStats todayStats = getTodayStats(today);
        List<DashboardResponse.DailyStats> last7Days = getLast7DaysStats(today);
        
        return new DashboardResponse(todayStats, last7Days);
    }
    
    private DashboardResponse.TodayStats getTodayStats(LocalDate today) {
        LocalDateTime start = today.atStartOfDay();
        LocalDateTime end = today.atTime(LocalTime.MAX);
        
        List<Appointment> todayAppointments = appointmentRepository.findAppointmentsBetween(start, end);
        long totalAppointments = todayAppointments.size();
        long completedAppointments = todayAppointments.stream()
            .filter(a -> a.getStatus() == Appointment.AppointmentStatus.COMPLETED)
            .count();
        
        List<QueueEntry> todayQueue = queueRepository.findQueueEntriesByDate(start, end);
        long activeQueue = todayQueue.stream()
            .filter(q -> q.getStatus() == QueueEntry.QueueStatus.WAITING || 
                        q.getStatus() == QueueEntry.QueueStatus.CALLED)
            .count();
        long completedQueue = todayQueue.stream()
            .filter(q -> q.getStatus() == QueueEntry.QueueStatus.COMPLETED)
            .count();
        
        Double averageWaitingTime = calculateAverageWaitingTime(todayQueue);
        
        return new DashboardResponse.TodayStats(
            totalAppointments,
            completedAppointments,
            activeQueue,
            completedQueue,
            averageWaitingTime
        );
    }
    
    private List<DashboardResponse.DailyStats> getLast7DaysStats(LocalDate today) {
        List<DashboardResponse.DailyStats> stats = new ArrayList<>();
        
        for (int i = 6; i >= 0; i--) {
            LocalDate date = today.minusDays(i);
            LocalDateTime start = date.atStartOfDay();
            LocalDateTime end = date.atTime(LocalTime.MAX);
            
            List<Appointment> appointments = appointmentRepository.countByDateRangeAndStatuses(
                start, end, 
                Arrays.asList(Appointment.AppointmentStatus.COMPLETED, Appointment.AppointmentStatus.SCHEDULED)
            );
            List<QueueEntry> queue = queueRepository.findQueueEntriesByDate(start, end);
            
            stats.add(new DashboardResponse.DailyStats(
                date.toString(),
                appointments.size(),
                queue.size()
            ));
        }
        
        return stats;
    }
    
    /**
     * Average wait in minutes from joining the queue until being called/served.
     * Uses queueDate (Bangkok wall-clock, same as calledAt/startedAt) rather than
     * createdAt, which may be stamped in the JVM default zone via JPA auditing.
     * Returns 0 when there is no measurable wait data for today.
     */
    private Double calculateAverageWaitingTime(List<QueueEntry> entries) {
        List<Long> waitMinutes = entries.stream()
            .map(this::waitingMinutes)
            .flatMap(Optional::stream)
            .toList();

        if (waitMinutes.isEmpty()) {
            return 0.0;
        }

        double average = waitMinutes.stream().mapToLong(Long::longValue).average().orElse(0.0);
        return (double) Math.round(average);
    }

    private Optional<Long> waitingMinutes(QueueEntry entry) {
        LocalDateTime start = entry.getQueueDate() != null ? entry.getQueueDate() : entry.getCreatedAt();
        LocalDateTime end = entry.getCalledAt() != null
            ? entry.getCalledAt()
            : (entry.getStartedAt() != null ? entry.getStartedAt() : entry.getCompletedAt());

        if (start == null || end == null || end.isBefore(start)) {
            return Optional.empty();
        }
        return Optional.of(Math.max(0L, Duration.between(start, end).toMinutes()));
    }
}
