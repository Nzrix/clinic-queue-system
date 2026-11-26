import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="login-container">
      <div class="login-card">
        <h1>เข้าสู่ระบบ</h1>
        <p class="subtitle">ระบบจัดการคิวและนัดหมายคลินิก</p>
        
        <div *ngIf="error" class="alert alert-error">{{ error }}</div>
        
        <form (ngSubmit)="onSubmit()">
          <div class="form-group">
            <label>ชื่อผู้ใช้</label>
            <input 
              type="text" 
              class="form-control" 
              [(ngModel)]="credentials.username"
              name="username"
              required
              placeholder="กรอกชื่อผู้ใช้">
          </div>
          
          <div class="form-group">
            <label>รหัสผ่าน</label>
            <input 
              type="password" 
              class="form-control"
              [(ngModel)]="credentials.password"
              name="password"
              required
              placeholder="กรอกรหัสผ่าน">
          </div>
          
          <button type="submit" class="btn btn-primary btn-block" [disabled]="loading">
            {{ loading ? 'กำลังเข้าสู่ระบบ...' : 'เข้าสู่ระบบ' }}
          </button>
        </form>
        
        <div class="demo-info">
          <p><strong>บัญชีทดสอบ:</strong></p>
          <p>Username: demo</p>
          <p>Password: demo123</p>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .login-container {
      display: flex;
      justify-content: center;
      align-items: center;
      min-height: 100vh;
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    }

    .login-card {
      background: white;
      padding: 40px;
      border-radius: 12px;
      box-shadow: 0 10px 40px rgba(0,0,0,0.2);
      width: 100%;
      max-width: 400px;
    }

    h1 {
      text-align: center;
      color: #2c3e50;
      margin-bottom: 10px;
    }

    .subtitle {
      text-align: center;
      color: #7f8c8d;
      margin-bottom: 30px;
    }

    .btn-block {
      width: 100%;
      margin-top: 20px;
    }

    .demo-info {
      margin-top: 30px;
      padding: 15px;
      background-color: #f8f9fa;
      border-radius: 4px;
      font-size: 14px;
    }

    .demo-info p {
      margin: 5px 0;
    }
  `]
})
export class LoginComponent {
  credentials = { username: '', password: '' };
  loading = false;
  error = '';

  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

  onSubmit() {
    this.loading = true;
    this.error = '';

    this.authService.login(this.credentials).subscribe({
      next: () => {
        this.router.navigate(['/dashboard']);
      },
      error: (err) => {
        this.error = 'ชื่อผู้ใช้หรือรหัสผ่านไม่ถูกต้อง';
        this.loading = false;
      }
    });
  }
}
