export interface DashboardResponse {
  todayStats: TodayStats;
  last7Days: DailyStats[];
}

export interface TodayStats {
  totalAppointments: number;
  completedAppointments: number;
  activeQueue: number;
  completedQueue: number;
  averageWaitingTimeMinutes: number | null;
}

export interface DailyStats {
  date: string;
  appointmentCount: number;
  queueCount: number;
}
