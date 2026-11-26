import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DashboardService } from '../../services/dashboard.service';
import { DashboardResponse } from '../../models/dashboard.model';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="container">
      <h1>แดชบอร์ด</h1>
      
      <div *ngIf="loading" class="loading">กำลังโหลดข้อมูล...</div>
      
      <div *ngIf="!loading && dashboardData">
        <div class="stats-grid">
          <div class="stat-card">
            <div class="stat-value">{{ dashboardData.todayStats.totalAppointments }}</div>
            <div class="stat-label">นัดหมายวันนี้</div>
          </div>
          
          <div class="stat-card">
            <div class="stat-value">{{ dashboardData.todayStats.completedAppointments }}</div>
            <div class="stat-label">นัดหมายที่เสร็จสิ้น</div>
          </div>
          
          <div class="stat-card">
            <div class="stat-value">{{ dashboardData.todayStats.activeQueue }}</div>
            <div class="stat-label">คิวรอปัจจุบัน</div>
          </div>
          
          <div class="stat-card">
            <div class="stat-value">{{ dashboardData.todayStats.completedQueue }}</div>
            <div class="stat-label">คิวที่เสร็จสิ้น</div>
          </div>
          
          <div class="stat-card" *ngIf="dashboardData.todayStats.averageWaitingTimeMinutes">
            <div class="stat-value">{{ dashboardData.todayStats.averageWaitingTimeMinutes | number:'1.0-0' }}</div>
            <div class="stat-label">ระยะเวลารอเฉลี่ย (นาที)</div>
          </div>
        </div>
        
        <div class="card">
          <h2>สถิติ 7 วันที่ผ่านมา</h2>
          <div class="chart-container">
            <table class="table">
              <thead>
                <tr>
                  <th>วันที่</th>
                  <th>นัดหมาย</th>
                  <th>คิวรอ</th>
                </tr>
              </thead>
              <tbody>
                <tr *ngFor="let day of dashboardData.last7Days">
                  <td>{{ day.date | date:'dd/MM/yyyy' }}</td>
                  <td>{{ day.appointmentCount }}</td>
                  <td>{{ day.queueCount }}</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    h1 {
      margin-bottom: 30px;
      color: #2c3e50;
    }

    h2 {
      margin-bottom: 20px;
      color: #2c3e50;
      font-size: 20px;
    }

    .chart-container {
      overflow-x: auto;
    }
  `]
})
export class DashboardComponent implements OnInit {
  dashboardData: DashboardResponse | null = null;
  loading = true;

  constructor(private dashboardService: DashboardService) {}

  ngOnInit() {
    this.loadDashboard();
  }

  loadDashboard() {
    this.dashboardService.getDashboardData().subscribe({
      next: (data) => {
        this.dashboardData = data;
        this.loading = false;
      },
      error: (err) => {
        console.error('Error loading dashboard:', err);
        this.loading = false;
      }
    });
  }
}
