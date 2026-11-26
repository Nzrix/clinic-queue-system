export interface Appointment {
  id?: number;
  patientId: number;
  patientName?: string;
  patientPhone?: string;
  appointmentTime: string;
  durationMinutes: number;
  status: 'SCHEDULED' | 'COMPLETED' | 'CANCELLED' | 'NO_SHOW';
  notes?: string;
  createdAt?: string;
  updatedAt?: string;
}
