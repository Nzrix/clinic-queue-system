import { Component, Inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { Patient } from '../../models/patient.model';

export interface QueueDialogData {
  patients: Patient[];
}

@Component({
  selector: 'app-queue-dialog',
  standalone: true,
  imports: [CommonModule, FormsModule, MatDialogModule, MatFormFieldModule, MatInputModule, MatSelectModule, MatButtonModule],
  template: `
    <h2 mat-dialog-title>เพิ่มคิว Walk-in</h2>
    <mat-dialog-content>
      <mat-form-field appearance="outline" class="full-width">
        <mat-label>ผู้ป่วย</mat-label>
        <mat-select [(ngModel)]="patientId" name="patientId" required>
          <mat-option [value]="0" disabled>-- เลือกผู้ป่วย --</mat-option>
          <mat-option *ngFor="let p of data.patients" [value]="p.id">{{ p.name }} ({{ p.phone }})</mat-option>
        </mat-select>
      </mat-form-field>
      <mat-form-field appearance="outline" class="full-width">
        <mat-label>หมายเหตุ</mat-label>
        <textarea matInput rows="3" [(ngModel)]="notes" name="notes"></textarea>
      </mat-form-field>
    </mat-dialog-content>
    <mat-dialog-actions align="end">
      <button mat-button type="button" mat-dialog-close>ยกเลิก</button>
      <button mat-flat-button color="primary" type="button" [disabled]="!patientId" (click)="save()">เพิ่มคิว</button>
    </mat-dialog-actions>
  `
})
export class QueueDialogComponent {
  patientId = 0;
  notes = '';

  constructor(
    private dialogRef: MatDialogRef<QueueDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: QueueDialogData
  ) {}

  save() {
    this.dialogRef.close({ patientId: this.patientId, notes: this.notes });
  }
}
