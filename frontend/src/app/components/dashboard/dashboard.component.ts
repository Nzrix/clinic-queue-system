import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { NgChartsModule } from 'ng2-charts';
import { ChartConfiguration, ChartData } from 'chart.js';
import { DashboardService } from '../../services/dashboard.service';
import { QueueService } from '../../services/queue.service';
import { DashboardResponse } from '../../models/dashboard.model';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, MatCardModule, MatIconModule, MatProgressSpinnerModule, NgChartsModule],
  template: `
    <div class="page">
      <div class="page-header">
        <div>
          <h1>แดชบอร์ด</h1>
          <p>ภาพรวมนัดหมายและคิววันนี้</p>
        </div>
      </div>

      <div class="loading-state" *ngIf="loading">
        <mat-spinner diameter="40"></mat-spinner>
        <div>กำลังโหลดข้อมูล...</div>
      </div>

      <ng-container *ngIf="!loading && dashboardData">
        <div class="stats-grid">
          <mat-card class="stat">
            <mat-icon>event</mat-icon>
            <div>
              <div class="value">{{ dashboardData.todayStats.totalAppointments }}</div>
              <div class="label">นัดหมายวันนี้</div>
            </div>
          </mat-card>
          <mat-card class="stat">
            <mat-icon>task_alt</mat-icon>
            <div>
              <div class="value">{{ dashboardData.todayStats.completedAppointments }}</div>
              <div class="label">นัดหมายที่เสร็จ</div>
            </div>
          </mat-card>
          <mat-card class="stat">
            <mat-icon>hourglass_top</mat-icon>
            <div>
              <div class="value">{{ dashboardData.todayStats.activeQueue }}</div>
              <div class="label">คิวรอปัจจุบัน</div>
            </div>
          </mat-card>
          <mat-card class="stat">
            <mat-icon>done_all</mat-icon>
            <div>
              <div class="value">{{ dashboardData.todayStats.completedQueue }}</div>
              <div class="label">คิวที่เสร็จสิ้น</div>
            </div>
          </mat-card>
          <mat-card class="stat" *ngIf="dashboardData.todayStats.averageWaitingTimeMinutes != null">
            <mat-icon>timer</mat-icon>
            <div>
              <div class="value">{{ dashboardData.todayStats.averageWaitingTimeMinutes | number:'1.0-0' }}</div>
              <div class="label">รอเฉลี่ย (นาที)</div>
            </div>
          </mat-card>
        </div>

        <div class="charts">
          <mat-card class="chart-card">
            <h2>นัดหมาย / คิว 7 วันล่าสุด</h2>
            <div class="chart-box">
              <canvas
                *ngIf="appointmentsChartReady"
                baseChart
                [data]="appointmentsChartData"
                [options]="lineOptions"
                [type]="'line'">
              </canvas>
            </div>
          </mat-card>

          <mat-card class="chart-card">
            <h2>สถานะคิววันนี้</h2>
            <div class="empty-state compact" *ngIf="!hasQueueStatusData; else donut">
              <mat-icon>pie_chart</mat-icon>
              <div>ยังไม่มีข้อมูลคิววันนี้</div>
            </div>
            <ng-template #donut>
              <div class="chart-box">
                <canvas
                  *ngIf="queueChartReady"
                  baseChart
                  [data]="queueStatusChartData"
                  [options]="doughnutOptions"
                  [type]="'doughnut'">
                </canvas>
              </div>
            </ng-template>
          </mat-card>
        </div>
      </ng-container>
    </div>
  `,
  styles: [`
    .stats-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));
      gap: 16px;
      margin-bottom: 24px;
    }

    .stat {
      display: flex;
      gap: 14px;
      align-items: center;
      padding: 18px;
      border-radius: 16px;
    }

    .stat mat-icon {
      color: var(--clinic-primary);
      background: var(--clinic-primary-soft);
      border-radius: 12px;
      padding: 10px;
      width: 44px;
      height: 44px;
      font-size: 24px;
    }

    .value {
      font-size: 1.8rem;
      font-weight: 700;
      line-height: 1.1;
    }

    .label {
      color: var(--clinic-muted);
      font-size: 0.9rem;
    }

    .charts {
      display: grid;
      grid-template-columns: 1.4fr 1fr;
      gap: 16px;
      align-items: start;
    }

    .chart-card {
      padding: 20px;
      border-radius: 16px;
    }

    .chart-card h2 {
      margin: 0 0 12px;
      font-size: 1.1rem;
    }

    /* Fixed height stops Chart.js responsive resize loops */
    .chart-box {
      position: relative;
      width: 100%;
      height: 300px;
    }

    .chart-box canvas {
      max-height: 100%;
    }

    .empty-state.compact {
      height: 300px;
      padding: 24px;
    }

    @media (max-width: 960px) {
      .charts {
        grid-template-columns: 1fr;
      }
    }
  `]
})
export class DashboardComponent implements OnInit {
  dashboardData: DashboardResponse | null = null;
  loading = true;
  hasQueueStatusData = false;
  appointmentsChartReady = false;
  queueChartReady = false;

  appointmentsChartData: ChartData<'line'> = { labels: [], datasets: [] };
  queueStatusChartData: ChartData<'doughnut'> = { labels: [], datasets: [] };

  lineOptions: ChartConfiguration<'line'>['options'] = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: { legend: { position: 'bottom' } },
    scales: {
      x: {
        ticks: { maxRotation: 0, autoSkip: false }
      },
      y: {
        beginAtZero: true,
        ticks: { precision: 0, stepSize: 1 }
      }
    }
  };

  doughnutOptions: ChartConfiguration<'doughnut'>['options'] = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: { legend: { position: 'bottom' } }
  };

  constructor(
    private dashboardService: DashboardService,
    private queueService: QueueService
  ) {}

  ngOnInit() {
    this.loadDashboard();
  }

  loadDashboard() {
    this.loading = true;
    this.appointmentsChartReady = false;
    this.queueChartReady = false;

    this.dashboardService.getDashboardData().subscribe({
      next: (data) => {
        this.dashboardData = data;
        this.buildAppointmentsChart(data);
        this.loading = false;
        // Defer chart mount until the fixed-height box is in the DOM
        setTimeout(() => { this.appointmentsChartReady = true; });
      },
      error: () => {
        this.loading = false;
      }
    });

    this.queueService.getTodayQueue().subscribe({
      next: (entries) => {
        this.buildQueueStatusChart(entries.map(e => e.status));
        setTimeout(() => { this.queueChartReady = this.hasQueueStatusData; });
      },
      error: () => {
        this.hasQueueStatusData = false;
        this.queueChartReady = false;
      }
    });
  }

  private buildAppointmentsChart(data: DashboardResponse) {
    const days = data.last7Days || [];
    this.appointmentsChartData = {
      labels: days.map(d => this.formatDayLabel(d.date)),
      datasets: [
        {
          data: days.map(d => Number(d.appointmentCount) || 0),
          label: 'นัดหมาย',
          borderColor: '#0f766e',
          backgroundColor: 'rgba(15, 118, 110, 0.15)',
          fill: true,
          tension: 0.35,
          pointRadius: 4,
          pointHoverRadius: 6
        },
        {
          data: days.map(d => Number(d.queueCount) || 0),
          label: 'คิว',
          borderColor: '#0891b2',
          backgroundColor: 'rgba(8, 145, 178, 0.12)',
          fill: true,
          tension: 0.35,
          pointRadius: 4,
          pointHoverRadius: 6
        }
      ]
    };
  }

  private formatDayLabel(dateStr: string): string {
    const d = new Date(dateStr);
    if (isNaN(d.getTime())) return dateStr;
    const pad = (n: number) => String(n).padStart(2, '0');
    return `${pad(d.getDate())}/${pad(d.getMonth() + 1)}`;
  }

  private buildQueueStatusChart(statuses: string[]) {
    const labels = ['WAITING', 'CALLED', 'IN_SERVICE', 'COMPLETED', 'SKIPPED'];
    const thai: Record<string, string> = {
      WAITING: 'รอเรียก',
      CALLED: 'เรียกแล้ว',
      IN_SERVICE: 'กำลังบริการ',
      COMPLETED: 'เสร็จสิ้น',
      SKIPPED: 'ข้าม'
    };
    const counts = labels.map(l => statuses.filter(s => s === l).length);
    this.hasQueueStatusData = counts.some(c => c > 0);
    this.queueStatusChartData = {
      labels: labels.map(l => thai[l]),
      datasets: [{
        data: counts,
        backgroundColor: ['#fbbf24', '#22d3ee', '#60a5fa', '#34d399', '#94a3b8']
      }]
    };
  }
}
