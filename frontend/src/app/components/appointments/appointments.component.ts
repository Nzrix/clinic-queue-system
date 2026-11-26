import { Component, OnInit, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatTableModule, MatTableDataSource } from '@angular/material/table';
import { MatSort, MatSortModule } from '@angular/material/sort';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatChipsModule } from '@angular/material/chips';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatTooltipModule } from '@angular/material/tooltip';
import { AppointmentService } from '../../services/appointment.service';
import { PatientService } from '../../services/patient.service';
import { Appointment } from '../../models/appointment.model';
import { Patient } from '../../models/patient.model';
import { AppointmentDialogComponent } from './appointment-dialog.component';
import { ConfirmDialogComponent } from '../shared/confirm-dialog.component';

@Component({
  selector: 'app-appointments',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatTableModule,
    MatSortModule,
    MatPaginatorModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
    MatChipsModule,
    MatDatepickerModule,
    MatDialogModule,
    MatSnackBarModule,
    MatProgressSpinnerModule,
    MatTooltipModule
  ],
  templateUrl: './appointments.component.html',
  styleUrl: './appointments.component.css'
})
export class AppointmentsComponent implements OnInit {
  displayedColumns = ['time', 'patientName', 'patientPhone', 'durationMinutes', 'status', 'notes', 'actions'];
  dataSource = new MatTableDataSource<Appointment>([]);
  patients: Patient[] = [];
  loading = false;
  selectedDate: Date = new Date();
  filterText = '';

  statusLabels: Record<string, string> = {
    SCHEDULED: 'นัดหมายแล้ว',
    COMPLETED: 'เสร็จสิ้น',
    CANCELLED: 'ยกเลิก',
    NO_SHOW: 'ไม่มาตามนัด'
  };

  @ViewChild(MatSort) sort!: MatSort;
  @ViewChild(MatPaginator) paginator!: MatPaginator;

  constructor(
    private appointmentService: AppointmentService,
    private patientService: PatientService,
    private dialog: MatDialog,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit() {
    this.loadAppointments();
    this.loadPatients();
  }

  private dateKey(d: Date): string {
    const pad = (n: number) => String(n).padStart(2, '0');
    return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
  }

  loadAppointments() {
    this.loading = true;
    const key = this.dateKey(this.selectedDate);
    this.appointmentService.getAppointments(key, key).subscribe({
      next: (data) => {
        this.dataSource.data = data;
        this.dataSource.filterPredicate = (row, filter) =>
          (row.patientName || '').toLowerCase().includes(filter) ||
          (row.patientPhone || '').toLowerCase().includes(filter) ||
          (row.notes || '').toLowerCase().includes(filter);
        this.applyFilter();
        this.loading = false;
        setTimeout(() => {
          this.dataSource.sort = this.sort;
          this.dataSource.paginator = this.paginator;
        });
      },
      error: () => {
        this.loading = false;
        this.snackBar.open('โหลดนัดหมายไม่สำเร็จ', 'ปิด', { duration: 3500 });
      }
    });
  }

  loadPatients() {
    this.patientService.getPatients('', 0, 1000).subscribe({
      next: (response) => { this.patients = response.content; }
    });
  }

  applyFilter() {
    this.dataSource.filter = this.filterText.trim().toLowerCase();
  }

  openAdd() {
    const ref = this.dialog.open(AppointmentDialogComponent, {
      width: '520px',
      data: {
        editMode: false,
        patients: this.patients,
        appointment: {
          patientId: 0,
          appointmentTime: '',
          durationMinutes: 30,
          status: 'SCHEDULED',
          notes: ''
        }
      }
    });
    ref.afterClosed().subscribe(result => {
      if (!result) return;
      this.appointmentService.createAppointment(result).subscribe({
        next: () => {
          this.snackBar.open('สร้างนัดหมายแล้ว', 'ปิด', { duration: 2500 });
          this.loadAppointments();
        },
        error: (err) => {
          const msg = err.error?.message || 'บันทึกนัดหมายไม่สำเร็จ';
          this.snackBar.open(msg, 'ปิด', { duration: 5000 });
        }
      });
    });
  }

  openEdit(appointment: Appointment) {
    const ref = this.dialog.open(AppointmentDialogComponent, {
      width: '520px',
      data: {
        editMode: true,
        patients: this.patients,
        appointment: { ...appointment }
      }
    });
    ref.afterClosed().subscribe(result => {
      if (!result) return;
      this.appointmentService.updateAppointment(appointment.id!, result).subscribe({
        next: () => {
          this.snackBar.open('อัปเดตนัดหมายแล้ว', 'ปิด', { duration: 2500 });
          this.loadAppointments();
        },
        error: (err) => {
          const msg = err.error?.message || 'บันทึกนัดหมายไม่สำเร็จ';
          this.snackBar.open(msg, 'ปิด', { duration: 5000 });
        }
      });
    });
  }

  updateStatus(id: number, status: string) {
    this.appointmentService.updateAppointmentStatus(id, status).subscribe({
      next: () => {
        this.snackBar.open('อัปเดตสถานะแล้ว', 'ปิด', { duration: 2000 });
        this.loadAppointments();
      },
      error: () => this.snackBar.open('อัปเดตสถานะไม่สำเร็จ', 'ปิด', { duration: 3500 })
    });
  }

  cancelAppointment(appointment: Appointment) {
    const ref = this.dialog.open(ConfirmDialogComponent, {
      width: '400px',
      data: {
        title: 'ยกเลิกนัดหมาย',
        message: `ต้องการยกเลิกนัดของ ${appointment.patientName} หรือไม่?`,
        confirmText: 'ยกเลิกนัด'
      }
    });
    ref.afterClosed().subscribe(ok => {
      if (!ok) return;
      this.appointmentService.deleteAppointment(appointment.id!).subscribe({
        next: () => {
          this.snackBar.open('ยกเลิกนัดหมายแล้ว', 'ปิด', { duration: 2500 });
          this.loadAppointments();
        },
        error: () => this.snackBar.open('ยกเลิกไม่สำเร็จ', 'ปิด', { duration: 3500 })
      });
    });
  }

  formatTime(datetime: string): string {
    return new Date(datetime).toLocaleTimeString('th-TH', { hour: '2-digit', minute: '2-digit' });
  }
}
