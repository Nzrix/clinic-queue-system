import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
    MatProgressSpinnerModule,
    MatSnackBarModule
  ],
  template: `
    <div class="login-page">
      <mat-card class="login-card">
        <div class="brand-mark">
          <mat-icon>local_hospital</mat-icon>
        </div>
        <h1>Clinic Queue</h1>
        <p class="subtitle">เข้าสู่ระบบจัดการคิวและนัดหมายคลินิก</p>

        <form (ngSubmit)="onSubmit()">
          <mat-form-field appearance="outline" class="full-width">
            <mat-label>ชื่อผู้ใช้</mat-label>
            <input matInput [(ngModel)]="credentials.username" name="username" required autocomplete="username">
            <mat-icon matSuffix>person</mat-icon>
          </mat-form-field>

          <mat-form-field appearance="outline" class="full-width">
            <mat-label>รหัสผ่าน</mat-label>
            <input matInput [type]="hide ? 'password' : 'text'" [(ngModel)]="credentials.password" name="password" required autocomplete="current-password">
            <button mat-icon-button matSuffix type="button" (click)="hide = !hide" [attr.aria-label]="'แสดงรหัสผ่าน'">
              <mat-icon>{{ hide ? 'visibility_off' : 'visibility' }}</mat-icon>
            </button>
          </mat-form-field>

          <button mat-flat-button color="primary" class="full-width submit" type="submit" [disabled]="loading">
            <mat-spinner *ngIf="loading" diameter="20"></mat-spinner>
            <span *ngIf="!loading">เข้าสู่ระบบ</span>
          </button>
        </form>

        <div class="demo-box">
          <mat-icon>info</mat-icon>
          <div>
            <strong>บัญชีทดสอบ</strong>
            <div>demo / demo123</div>
          </div>
        </div>
      </mat-card>
    </div>
  `,
  styles: [`
    .login-page {
      min-height: 100vh;
      display: grid;
      place-items: center;
      padding: 24px;
      background:
        radial-gradient(circle at 20% 20%, rgba(20, 184, 166, 0.25), transparent 40%),
        radial-gradient(circle at 80% 0%, rgba(8, 145, 178, 0.2), transparent 35%),
        linear-gradient(160deg, #0f766e 0%, #115e59 45%, #164e63 100%);
    }

    .login-card {
      width: 100%;
      max-width: 420px;
      padding: 32px 28px;
      border-radius: 20px;
      box-shadow: 0 20px 60px rgba(0,0,0,0.25);
    }

    .brand-mark {
      width: 56px;
      height: 56px;
      border-radius: 16px;
      display: grid;
      place-items: center;
      background: var(--clinic-primary-soft);
      color: var(--clinic-primary);
      margin-bottom: 16px;
    }

    h1 {
      margin: 0;
      font-size: 1.8rem;
      color: var(--clinic-ink);
    }

    .subtitle {
      margin: 8px 0 24px;
      color: var(--clinic-muted);
    }

    .submit {
      height: 44px;
      margin-top: 8px;
    }

    .demo-box {
      margin-top: 24px;
      display: flex;
      gap: 12px;
      padding: 14px;
      border-radius: 12px;
      background: #f8fafc;
      color: var(--clinic-muted);
      align-items: flex-start;
    }

    .demo-box strong {
      display: block;
      color: var(--clinic-ink);
    }
  `]
})
export class LoginComponent {
  credentials = { username: '', password: '' };
  loading = false;
  hide = true;

  constructor(
    private authService: AuthService,
    private router: Router,
    private snackBar: MatSnackBar
  ) {}

  onSubmit() {
    this.loading = true;
    this.authService.login(this.credentials).subscribe({
      next: () => {
        this.snackBar.open('เข้าสู่ระบบสำเร็จ', 'ปิด', { duration: 2500 });
        this.router.navigate(['/dashboard']);
      },
      error: () => {
        this.loading = false;
        this.snackBar.open('ชื่อผู้ใช้หรือรหัสผ่านไม่ถูกต้อง', 'ปิด', {
          duration: 4000,
          panelClass: ['snack-error']
        });
      }
    });
  }
}
