import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AppointmentService } from '../../services/appointment.service';
import { PatientService } from '../../services/patient.service';
import { Appointment } from '../../models/appointment.model';
import { Patient } from '../../models/patient.model';

@Component({
  selector: 'app-appointments',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './appointments.component.html',
  styleUrl: './appointments.component.css'
})
export class AppointmentsComponent implements OnInit {
  appointments: Appointment[] = [];
  patients: Patient[] = [];
  loading = false;
  selectedDate = new Date().toISOString().split('T')[0];
  
  showModal = false;
  editMode = false;
  currentAppointment: Appointment = this.getEmptyAppointment();
  error = '';

  statusLabels: {[key: string]: string} = {
    'SCHEDULED': 'นัดหมายแล้ว',
    'COMPLETED': 'เสร็จสิ้น',
    'CANCELLED': 'ยกเลิก',
    'NO_SHOW': 'ไม่มาตามนัด'
  };

  statusClasses: {[key: string]: string} = {
    'SCHEDULED': 'badge-info',
    'COMPLETED': 'badge-success',
    'CANCELLED': 'badge-danger',
    'NO_SHOW': 'badge-warning'
  };

  constructor(
    private appointmentService: AppointmentService,
    private patientService: PatientService
  ) {}

  ngOnInit() {
    this.loadAppointments();
    this.loadPatients();
  }

  loadAppointments() {
    this.loading = true;
    const startDate = this.selectedDate;
    const endDate = this.selectedDate;
    
    this.appointmentService.getAppointments(startDate, endDate).subscribe({
      next: (data) => {
        this.appointments = data;
        this.loading = false;
      },
      error: (err) => {
        console.error('Error loading appointments:', err);
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

  onDateChange() {
    this.loadAppointments();
  }

  openAddModal() {
    this.editMode = false;
    this.currentAppointment = this.getEmptyAppointment();
    this.showModal = true;
    this.error = '';
  }

  openEditModal(appointment: Appointment) {
    this.editMode = true;
    this.currentAppointment = { ...appointment };
    this.showModal = true;
    this.error = '';
  }

  closeModal() {
    this.showModal = false;
    this.currentAppointment = this.getEmptyAppointment();
    this.error = '';
  }

  saveAppointment() {
    this.error = '';
    
    if (!this.currentAppointment.patientId || !this.currentAppointment.appointmentTime) {
      this.error = 'กรุณากรอกข้อมูลให้ครบถ้วน';
      return;
    }

    const request = this.editMode
      ? this.appointmentService.updateAppointment(this.currentAppointment.id!, this.currentAppointment)
      : this.appointmentService.createAppointment(this.currentAppointment);

    request.subscribe({
      next: () => {
        this.loadAppointments();
        this.closeModal();
      },
      error: (err) => {
        this.error = err.error?.message || 'เกิดข้อผิดพลาดในการบันทึกข้อมูล';
      }
    });
  }

  updateStatus(id: number, status: string) {
    this.appointmentService.updateAppointmentStatus(id, status).subscribe({
      next: () => {
        this.loadAppointments();
      },
      error: (err) => {
        alert('เกิดข้อผิดพลาดในการอัปเดตสถานะ');
      }
    });
  }

  cancelAppointment(id: number) {
    if (confirm('ต้องการยกเลิกนัดหมายนี้หรือไม่?')) {
      this.appointmentService.deleteAppointment(id).subscribe({
        next: () => {
          this.loadAppointments();
        },
        error: (err) => {
          alert('เกิดข้อผิดพลาดในการยกเลิกนัดหมาย');
        }
      });
    }
  }

  private getEmptyAppointment(): Appointment {
    return {
      patientId: 0,
      appointmentTime: '',
      durationMinutes: 30,
      status: 'SCHEDULED',
      notes: ''
    };
  }

  formatTime(datetime: string): string {
    return new Date(datetime).toLocaleTimeString('th-TH', { hour: '2-digit', minute: '2-digit' });
  }
}
