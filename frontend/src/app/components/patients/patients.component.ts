import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { PatientService } from '../../services/patient.service';
import { Patient } from '../../models/patient.model';

@Component({
  selector: 'app-patients',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './patients.component.html',
  styleUrl: './patients.component.css'
})
export class PatientsComponent implements OnInit {
  patients: Patient[] = [];
  searchTerm = '';
  loading = false;
  currentPage = 0;
  totalPages = 0;
  pageSize = 10;
  
  showModal = false;
  editMode = false;
  currentPatient: Patient = this.getEmptyPatient();
  error = '';

  constructor(private patientService: PatientService) {}

  ngOnInit() {
    this.loadPatients();
  }

  loadPatients() {
    this.loading = true;
    this.patientService.getPatients(this.searchTerm, this.currentPage, this.pageSize).subscribe({
      next: (response) => {
        this.patients = response.content;
        this.totalPages = response.totalPages;
        this.loading = false;
      },
      error: (err) => {
        console.error('Error loading patients:', err);
        this.loading = false;
      }
    });
  }

  onSearch() {
    this.currentPage = 0;
    this.loadPatients();
  }

  nextPage() {
    if (this.currentPage < this.totalPages - 1) {
      this.currentPage++;
      this.loadPatients();
    }
  }

  previousPage() {
    if (this.currentPage > 0) {
      this.currentPage--;
      this.loadPatients();
    }
  }

  openAddModal() {
    this.editMode = false;
    this.currentPatient = this.getEmptyPatient();
    this.showModal = true;
    this.error = '';
  }

  openEditModal(patient: Patient) {
    this.editMode = true;
    this.currentPatient = { ...patient };
    this.showModal = true;
    this.error = '';
  }

  closeModal() {
    this.showModal = false;
    this.currentPatient = this.getEmptyPatient();
    this.error = '';
  }

  savePatient() {
    this.error = '';
    
    if (!this.currentPatient.name || !this.currentPatient.phone) {
      this.error = 'กรุณากรอกชื่อและเบอร์โทรศัพท์';
      return;
    }

    const request = this.editMode
      ? this.patientService.updatePatient(this.currentPatient.id!, this.currentPatient)
      : this.patientService.createPatient(this.currentPatient);

    request.subscribe({
      next: () => {
        this.loadPatients();
        this.closeModal();
      },
      error: (err) => {
        this.error = 'เกิดข้อผิดพลาดในการบันทึกข้อมูล';
      }
    });
  }

  deletePatient(id: number) {
    if (confirm('ต้องการลบผู้ป่วยรายนี้หรือไม่?')) {
      this.patientService.deletePatient(id).subscribe({
        next: () => {
          this.loadPatients();
        },
        error: (err) => {
          alert('เกิดข้อผิดพลาดในการลบข้อมูล');
        }
      });
    }
  }

  private getEmptyPatient(): Patient {
    return { name: '', phone: '', notes: '' };
  }
}
