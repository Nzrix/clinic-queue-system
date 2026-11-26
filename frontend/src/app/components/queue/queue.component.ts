import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatTableModule, MatTableDataSource } from '@angular/material/table';
import { MatSort, MatSortModule } from '@angular/material/sort';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatChipsModule } from '@angular/material/chips';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatTooltipModule } from '@angular/material/tooltip';
import { QueueService } from '../../services/queue.service';
import { PatientService } from '../../services/patient.service';
import { QueueEntry } from '../../models/queue.model';
import { Patient } from '../../models/patient.model';
import { QueueDialogComponent } from './queue-dialog.component';

@Component({
  selector: 'app-queue',
  standalone: true,
  imports: [
    CommonModule,
    MatTableModule,
    MatSortModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatChipsModule,
    MatDialogModule,
    MatSnackBarModule,
    MatProgressSpinnerModule,
    MatTooltipModule
  ],
  templateUrl: './queue.component.html',
  styleUrl: './queue.component.css'
})
export class QueueComponent implements OnInit, OnDestroy {
  displayedColumns = ['queueNumber', 'patientName', 'patientPhone', 'status', 'createdAt', 'actions'];
  dataSource = new MatTableDataSource<QueueEntry>([]);
  patients: Patient[] = [];
  loading = true;
  private timer?: ReturnType<typeof setInterval>;

  statusLabels: Record<string, string> = {
    WAITING: 'รอเรียก',
    CALLED: 'เรียกแล้ว',
    IN_SERVICE: 'กำลังให้บริการ',
    COMPLETED: 'เสร็จสิ้น',
    SKIPPED: 'ข้าม'
  };

  @ViewChild(MatSort) sort!: MatSort;

  constructor(
    private queueService: QueueService,
    private patientService: PatientService,
    private dialog: MatDialog,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit() {
    this.loadQueue();
    this.loadPatients();
    this.timer = setInterval(() => this.loadQueue(false), 30000);
  }

  ngOnDestroy() {
    if (this.timer) clearInterval(this.timer);
  }

  loadQueue(showSpinner = true) {
    if (showSpinner) this.loading = true;
    this.queueService.getTodayQueue().subscribe({
      next: (data) => {
        this.dataSource.data = data;
        this.loading = false;
        setTimeout(() => { this.dataSource.sort = this.sort; });
      },
      error: () => {
        this.loading = false;
        this.snackBar.open('โหลดคิวไม่สำเร็จ', 'ปิด', { duration: 3500 });
      }
    });
  }

  loadPatients() {
    this.patientService.getPatients('', 0, 1000).subscribe({
      next: (response) => { this.patients = response.content; }
    });
  }

  openAdd() {
    const ref = this.dialog.open(QueueDialogComponent, {
      width: '440px',
      data: { patients: this.patients }
    });
    ref.afterClosed().subscribe(result => {
      if (!result) return;
      this.queueService.createQueueEntry(result.patientId, result.notes).subscribe({
        next: () => {
          this.snackBar.open('ออกหมายเลขคิวแล้ว', 'ปิด', { duration: 2500 });
          this.loadQueue();
        },
        error: () => this.snackBar.open('เพิ่มคิวไม่สำเร็จ', 'ปิด', { duration: 3500 })
      });
    });
  }

  callNext() {
    this.queueService.callNext().subscribe({
      next: (entry) => {
        this.snackBar.open(`เรียกคิว ${entry.queueNumber}`, 'ปิด', { duration: 3000 });
        this.loadQueue();
      },
      error: (err) => {
        this.snackBar.open(err.error?.message || 'ไม่มีคิวที่รอเรียก', 'ปิด', { duration: 3500 });
      }
    });
  }

  updateStatus(id: number, status: string) {
    this.queueService.updateQueueStatus(id, status).subscribe({
      next: () => {
        this.snackBar.open('อัปเดตสถานะคิวแล้ว', 'ปิด', { duration: 2000 });
        this.loadQueue();
      },
      error: () => this.snackBar.open('อัปเดตสถานะไม่สำเร็จ', 'ปิด', { duration: 3500 })
    });
  }

  get waitingCount(): number {
    return this.dataSource.data.filter(q => q.status === 'WAITING').length;
  }

  get activeCount(): number {
    return this.dataSource.data.filter(q => q.status === 'CALLED' || q.status === 'IN_SERVICE').length;
  }

  get completedCount(): number {
    return this.dataSource.data.filter(q => q.status === 'COMPLETED').length;
  }
}
