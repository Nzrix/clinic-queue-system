import { Component, Inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { Patient } from '../../models/patient.model';

export interface PatientDialogData {
  patient: Patient;
  editMode: boolean;
}

@Component({
  selector: 'app-patient-dialog',
  standalone: true,
  imports: [CommonModule, FormsModule, MatDialogModule, MatFormFieldModule, MatInputModule, MatButtonModule],
  template: `
    <h2 mat-dialog-title>{{ data.editMode ? 'แก้ไขผู้ป่วย' : 'เพิ่มผู้ป่วย' }}</h2>
    <mat-dialog-content>
      <mat-form-field appearance="outline" class="full-width">
        <mat-label>ชื่อ-นามสกุล</mat-label>
        <input matInput [(ngModel)]="patient.name" name="name" required>
      </mat-form-field>
      <mat-form-field appearance="outline" class="full-width">
        <mat-label>เบอร์โทรศัพท์</mat-label>
        <input matInput [(ngModel)]="patient.phone" name="phone" required>
      </mat-form-field>
      <mat-form-field appearance="outline" class="full-width">
        <mat-label>หมายเหตุ</mat-label>
        <textarea matInput rows="3" [(ngModel)]="patient.notes" name="notes"></textarea>
      </mat-form-field>
    </mat-dialog-content>
    <mat-dialog-actions align="end">
      <button mat-button type="button" mat-dialog-close>ยกเลิก</button>
      <button mat-flat-button color="primary" type="button" [disabled]="!patient.name || !patient.phone" (click)="save()">บันทึก</button>
    </mat-dialog-actions>
  `
})
export class PatientDialogComponent {
  patient: Patient;

  constructor(
    private dialogRef: MatDialogRef<PatientDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: PatientDialogData
  ) {
    this.patient = { ...data.patient };
  }

  save() {
    this.dialogRef.close(this.patient);
  }
}
