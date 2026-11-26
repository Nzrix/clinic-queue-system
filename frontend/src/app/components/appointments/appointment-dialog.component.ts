import { Component, Inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { Patient } from '../../models/patient.model';
import { Appointment } from '../../models/appointment.model';

export interface AppointmentDialogData {
  appointment: Appointment;
  patients: Patient[];
  editMode: boolean;
}

@Component({
  selector: 'app-appointment-dialog',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatButtonModule,
    MatDatepickerModule
  ],
  template: `
    <h2 mat-dialog-title>{{ data.editMode ? 'แก้ไขนัดหมาย' : 'เพิ่มนัดหมาย' }}</h2>
    <mat-dialog-content>
      <mat-form-field appearance="outline" class="full-width">
        <mat-label>ผู้ป่วย</mat-label>
        <mat-select [(ngModel)]="appointment.patientId" name="patientId" required>
          <mat-option [value]="0" disabled>-- เลือกผู้ป่วย --</mat-option>
          <mat-option *ngFor="let p of data.patients" [value]="p.id">{{ p.name }} ({{ p.phone }})</mat-option>
        </mat-select>
      </mat-form-field>

      <div class="row">
        <mat-form-field appearance="outline" class="grow">
          <mat-label>วันที่</mat-label>
          <input matInput [matDatepicker]="picker" [(ngModel)]="appointmentDate" name="appointmentDate" required>
          <mat-datepicker-toggle matIconSuffix [for]="picker"></mat-datepicker-toggle>
          <mat-datepicker #picker></mat-datepicker>
        </mat-form-field>

        <mat-form-field appearance="outline" class="time-field">
          <mat-label>เวลา</mat-label>
          <input matInput type="time" [(ngModel)]="appointmentTime" name="appointmentTime" required>
        </mat-form-field>
      </div>

      <mat-form-field appearance="outline" class="full-width">
        <mat-label>ระยะเวลา (นาที)</mat-label>
        <input matInput type="number" min="15" [(ngModel)]="appointment.durationMinutes" name="durationMinutes" required>
      </mat-form-field>

      <mat-form-field appearance="outline" class="full-width">
        <mat-label>หมายเหตุ</mat-label>
        <textarea matInput rows="3" [(ngModel)]="appointment.notes" name="notes"></textarea>
      </mat-form-field>
    </mat-dialog-content>
    <mat-dialog-actions align="end">
      <button mat-button type="button" mat-dialog-close>ยกเลิก</button>
      <button mat-flat-button color="primary" type="button" [disabled]="!canSave" (click)="save()">บันทึก</button>
    </mat-dialog-actions>
  `,
  styles: [`
    .row {
      display: flex;
      gap: 12px;
    }
    .grow { flex: 1; }
    .time-field { width: 140px; }
  `]
})
export class AppointmentDialogComponent {
  appointment: Appointment;
  appointmentDate: Date | null = null;
  appointmentTime = '09:00';

  constructor(
    private dialogRef: MatDialogRef<AppointmentDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: AppointmentDialogData
  ) {
    this.appointment = { ...data.appointment };
    if (this.appointment.appointmentTime) {
      const dt = new Date(this.appointment.appointmentTime);
      if (!isNaN(dt.getTime())) {
        this.appointmentDate = dt;
        this.appointmentTime = `${String(dt.getHours()).padStart(2, '0')}:${String(dt.getMinutes()).padStart(2, '0')}`;
      }
    } else {
      this.appointmentDate = new Date();
    }
  }

  get canSave(): boolean {
    return !!this.appointment.patientId && !!this.appointmentDate && !!this.appointmentTime;
  }

  save() {
    if (!this.appointmentDate || !this.appointmentTime) return;
    const [h, m] = this.appointmentTime.split(':').map(Number);
    const dt = new Date(this.appointmentDate);
    dt.setHours(h, m, 0, 0);
    const pad = (n: number) => String(n).padStart(2, '0');
    this.appointment.appointmentTime =
      `${dt.getFullYear()}-${pad(dt.getMonth() + 1)}-${pad(dt.getDate())}T${pad(dt.getHours())}:${pad(dt.getMinutes())}:00`;
    this.dialogRef.close(this.appointment);
  }
}
