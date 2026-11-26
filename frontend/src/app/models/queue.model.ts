export interface QueueEntry {
  id?: number;
  patientId: number;
  patientName?: string;
  patientPhone?: string;
  queueNumber: string;
  queueDate: string;
  status: 'WAITING' | 'CALLED' | 'IN_SERVICE' | 'COMPLETED' | 'SKIPPED';
  calledAt?: string;
  startedAt?: string;
  completedAt?: string;
  notes?: string;
  createdAt?: string;
}
