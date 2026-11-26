import { Component, OnInit, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatTableModule, MatTableDataSource } from '@angular/material/table';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatSort, MatSortModule } from '@angular/material/sort';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatTooltipModule } from '@angular/material/tooltip';
import { PatientService } from '../../services/patient.service';
import { Patient } from '../../models/patient.model';
import { PatientDialogComponent } from './patient-dialog.component';
import { ConfirmDialogComponent } from '../shared/confirm-dialog.component';

@Component({
  selector: 'app-patients',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatTableModule,
    MatPaginatorModule,
    MatSortModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
    MatDialogModule,
    MatSnackBarModule,
    MatProgressSpinnerModule,
    MatTooltipModule
  ],
  templateUrl: './patients.component.html',
  styleUrl: './patients.component.css'
})
export class PatientsComponent implements OnInit {
  displayedColumns = ['name', 'phone', 'notes', 'actions'];
  dataSource = new MatTableDataSource<Patient>([]);
  loading = false;
  searchTerm = '';
  totalElements = 0;
  pageSize = 10;
  pageIndex = 0;

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  constructor(
    private patientService: PatientService,
    private dialog: MatDialog,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit() {
    this.loadPatients();
  }

  loadPatients() {
    this.loading = true;
    this.patientService.getPatients(this.searchTerm, this.pageIndex, this.pageSize).subscribe({
      next: (response) => {
        this.dataSource.data = response.content;
        this.totalElements = response.totalElements;
        this.loading = false;
        setTimeout(() => {
          if (this.sort) {
            this.dataSource.sort = this.sort;
          }
        });
      },
      error: () => {
        this.loading = false;
        this.snackBar.open('โหลดข้อมูลผู้ป่วยไม่สำเร็จ', 'ปิด', { duration: 3500 });
      }
    });
  }

  onSearch() {
    this.pageIndex = 0;
    this.loadPatients();
  }

  onPage(event: any) {
    this.pageIndex = event.pageIndex;
    this.pageSize = event.pageSize;
    this.loadPatients();
  }

  openAdd() {
    const ref = this.dialog.open(PatientDialogComponent, {
      width: '480px',
      data: { patient: { name: '', phone: '', notes: '' }, editMode: false }
    });
    ref.afterClosed().subscribe(result => {
      if (!result) return;
      this.patientService.createPatient(result).subscribe({
        next: () => {
          this.snackBar.open('เพิ่มผู้ป่วยแล้ว', 'ปิด', { duration: 2500 });
          this.loadPatients();
        },
        error: () => this.snackBar.open('บันทึกไม่สำเร็จ', 'ปิด', { duration: 3500 })
      });
    });
  }

  openEdit(patient: Patient) {
    const ref = this.dialog.open(PatientDialogComponent, {
      width: '480px',
      data: { patient: { ...patient }, editMode: true }
    });
    ref.afterClosed().subscribe(result => {
      if (!result) return;
      this.patientService.updatePatient(patient.id!, result).subscribe({
        next: () => {
          this.snackBar.open('อัปเดตผู้ป่วยแล้ว', 'ปิด', { duration: 2500 });
          this.loadPatients();
        },
        error: () => this.snackBar.open('บันทึกไม่สำเร็จ', 'ปิด', { duration: 3500 })
      });
    });
  }

  deletePatient(patient: Patient) {
    const ref = this.dialog.open(ConfirmDialogComponent, {
      width: '400px',
      data: {
        title: 'ลบผู้ป่วย',
        message: `ต้องการลบ "${patient.name}" หรือไม่?`
      }
    });
    ref.afterClosed().subscribe(ok => {
      if (!ok) return;
      this.patientService.deletePatient(patient.id!).subscribe({
        next: () => {
          this.snackBar.open('ลบผู้ป่วยแล้ว', 'ปิด', { duration: 2500 });
          this.loadPatients();
        },
        error: () => this.snackBar.open('ลบไม่สำเร็จ', 'ปิด', { duration: 3500 })
      });
    });
  }
}
