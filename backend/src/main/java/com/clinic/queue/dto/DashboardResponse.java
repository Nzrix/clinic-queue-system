package com.clinic.queue.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class DashboardResponse {
    private TodayStats todayStats;
    private List<DailyStats> last7Days;
    
    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    public static class TodayStats {
        private long totalAppointments;
        private long completedAppointments;
        private long activeQueue;
        private long completedQueue;
        private Double averageWaitingTimeMinutes;
    }
    
    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    public static class DailyStats {
        private String date;
        private long appointmentCount;
        private long queueCount;
    }
}
