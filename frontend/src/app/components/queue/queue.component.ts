import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { QueueService } from '../../services/queue.service';
import { PatientService } from '../../services/patient.service';
import { QueueEntry } from '../../models/queue.model';
import { Patient } from '../../models/patient.model';

@Component({
  selector: 'app-queue',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './queue.component.html',
  styleUrl: './queue.component.css'
})
export class QueueComponent implements OnInit {
  queueEntries: QueueEntry[] = [];
  patients: Patient[] = [];
  loading = false;
  
  showModal = false;
  selectedPatientId: number = 0;
  notes = '';
  error = '';

  statusLabels: {[key: string]: string} = {
    'WAITING': 'รอเรียก',
    'CALLED': 'เรียกแล้ว',
    'IN_SERVICE': 'กำลังให้บริการ',
    'COMPLETED': 'เสร็จสิ้น',
    'SKIPPED': 'ข้าม'
  };

  statusClasses: {[key: string]: string} = {
    'WAITING': 'badge-warning',
    'CALLED': 'badge-info',
    'IN_SERVICE': 'badge-info',
    'COMPLETED': 'badge-success',
    'SKIPPED': 'badge-secondary'
  };

  constructor(
    private queueService: QueueService,
    private patientService: PatientService
  ) {}

  ngOnInit() {
    this.loadQueue();
    this.loadPatients();
    
    setInterval(() => {
      this.loadQueue();
    }, 30000);
  }

  loadQueue() {
    this.queueService.getTodayQueue().subscribe({
      next: (data) => {
        this.queueEntries = data;
        this.loading = false;
      },
      error: (err) => {
        console.error('Error loading queue:', err);
        this.loading = false;
      }
    });
  }

  loadPatients() {
    this.patientService.getPatients('', 0, 1000).subscribe({
      next: (response) => {
        this.patients = response.content;
      },
      error: (err) => {
        console.error('Error loading patients:', err);
      }
    });
  }

  openAddModal() {
    this.selectedPatientId = 0;
    this.notes = '';
    this.showModal = true;
    this.error = '';
  }

  closeModal() {
    this.showModal = false;
    this.selectedPatientId = 0;
    this.notes = '';
    this.error = '';
  }

  addToQueue() {
    this.error = '';
    
    if (!this.selectedPatientId) {
      this.error = 'กรุณาเลือกผู้ป่วย';
      return;
    }

    this.queueService.createQueueEntry(this.selectedPatientId, this.notes).subscribe({
      next: () => {
        this.loadQueue();
        this.closeModal();
      },
      error: (err) => {
        this.error = 'เกิดข้อผิดพลาดในการเพิ่มคิว';
      }
    });
  }

  callNext() {
    this.queueService.callNext().subscribe({
      next: () => {
        this.loadQueue();
      },
      error: (err) => {
        alert(err.error?.message || 'ไม่มีคิวที่รอเรียก');
      }
    });
  }

  updateStatus(id: number, status: string) {
    this.queueService.updateQueueStatus(id, status).subscribe({
      next: () => {
        this.loadQueue();
      },
      error: (err) => {
        alert('เกิดข้อผิดพลาดในการอัปเดตสถานะ');
      }
    });
  }

  get waitingCount(): number {
    return this.queueEntries.filter(q => q.status === 'WAITING').length;
  }

  get activeCount(): number {
    return this.queueEntries.filter(q => q.status === 'CALLED' || q.status === 'IN_SERVICE').length;
  }

  get completedCount(): number {
    return this.queueEntries.filter(q => q.status === 'COMPLETED').length;
  }
}
