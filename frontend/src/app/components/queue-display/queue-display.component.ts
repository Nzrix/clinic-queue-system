import { Component, OnDestroy, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { QueueService } from '../../services/queue.service';
import { QueueEntry } from '../../models/queue.model';

@Component({
  selector: 'app-queue-display',
  standalone: true,
  imports: [CommonModule, MatIconModule],
  template: `
    <div class="tv">
      <header class="tv-header">
        <div class="brand">
          <mat-icon>tv</mat-icon>
          <div>
            <div class="clinic">Clinic Queue Display</div>
            <div class="sub">จอแสดงคิวสำหรับห้องรอ</div>
          </div>
        </div>
        <div class="clock">
          <div class="date">{{ currentTime | date:'fullDate' }}</div>
          <div class="time">{{ currentTime | date:'HH:mm:ss' }}</div>
        </div>
      </header>

      <section class="now-panel" [class.empty]="!currentQueue">
        <div class="eyebrow">กำลังเรียก / กำลังให้บริการ</div>
        <ng-container *ngIf="currentQueue; else idle">
          <div class="now-number">{{ currentQueue.queueNumber }}</div>
          <div class="now-name">{{ currentQueue.patientName }}</div>
          <div class="now-status">{{ statusLabel(currentQueue.status) }}</div>
        </ng-container>
        <ng-template #idle>
          <div class="now-number muted">—</div>
          <div class="now-name">รอการเรียกคิว</div>
        </ng-template>
      </section>

      <section class="next-panel">
        <div class="next-header">
          <h2>คิวถัดไป</h2>
          <span>รีเฟรชอัตโนมัติทุก 5 วินาที</span>
        </div>
        <div class="next-grid" *ngIf="waitingQueues.length; else noWaiting">
          <div class="next-card" *ngFor="let entry of waitingQueues; let i = index">
            <div class="rank">#{{ i + 1 }}</div>
            <div class="num">{{ entry.queueNumber }}</div>
          </div>
        </div>
        <ng-template #noWaiting>
          <div class="no-waiting">ไม่มีคิวที่รอ</div>
        </ng-template>
      </section>
    </div>
  `,
  styles: [`
    .tv {
      min-height: 100vh;
      padding: 32px 40px 40px;
      color: #ecfeff;
      background:
        radial-gradient(circle at top right, rgba(34, 211, 238, 0.25), transparent 35%),
        linear-gradient(145deg, #042f2e 0%, #0f766e 45%, #164e63 100%);
    }

    .tv-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      gap: 24px;
      margin-bottom: 28px;
      flex-wrap: wrap;
    }

    .brand {
      display: flex;
      gap: 14px;
      align-items: center;
    }

    .brand mat-icon {
      font-size: 42px;
      width: 42px;
      height: 42px;
    }

    .clinic {
      font-size: 1.6rem;
      font-weight: 700;
    }

    .sub, .date {
      opacity: 0.8;
    }

    .clock {
      text-align: right;
    }

    .time {
      font-size: 2.4rem;
      font-weight: 300;
      letter-spacing: 0.04em;
    }

    .now-panel {
      background: rgba(255,255,255,0.96);
      color: #0f172a;
      border-radius: 28px;
      padding: 48px 32px;
      text-align: center;
      box-shadow: 0 24px 60px rgba(0,0,0,0.28);
      margin-bottom: 28px;
      min-height: 340px;
      display: flex;
      flex-direction: column;
      justify-content: center;
    }

    .eyebrow {
      font-size: 1.4rem;
      color: #0f766e;
      font-weight: 600;
      letter-spacing: 0.08em;
      text-transform: uppercase;
    }

    .now-number {
      font-size: clamp(7rem, 18vw, 14rem);
      font-weight: 800;
      line-height: 0.95;
      color: #0f766e;
      margin: 12px 0;
    }

    .now-number.muted {
      opacity: 0.35;
    }

    .now-name {
      font-size: clamp(1.6rem, 3vw, 2.6rem);
      font-weight: 600;
    }

    .now-status {
      margin-top: 10px;
      color: #64748b;
      font-size: 1.2rem;
    }

    .next-panel {
      background: rgba(255,255,255,0.1);
      border: 1px solid rgba(255,255,255,0.15);
      border-radius: 24px;
      padding: 28px;
      backdrop-filter: blur(6px);
    }

    .next-header {
      display: flex;
      justify-content: space-between;
      align-items: baseline;
      gap: 12px;
      margin-bottom: 18px;
      flex-wrap: wrap;
    }

    .next-header h2 {
      margin: 0;
      font-size: 1.8rem;
    }

    .next-header span {
      opacity: 0.75;
    }

    .next-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(140px, 1fr));
      gap: 16px;
    }

    .next-card {
      background: rgba(255,255,255,0.95);
      color: #0f172a;
      border-radius: 18px;
      padding: 18px 12px;
      text-align: center;
    }

    .rank {
      color: #64748b;
      font-size: 0.9rem;
    }

    .num {
      font-size: 2.4rem;
      font-weight: 800;
      color: #0f766e;
    }

    .no-waiting {
      text-align: center;
      padding: 36px;
      font-size: 1.4rem;
      opacity: 0.85;
    }

    @media (max-width: 700px) {
      .tv { padding: 20px; }
      .now-panel { min-height: 260px; padding: 28px 16px; }
    }
  `]
})
export class QueueDisplayComponent implements OnInit, OnDestroy {
  queueEntries: QueueEntry[] = [];
  currentQueue: QueueEntry | null = null;
  waitingQueues: QueueEntry[] = [];
  currentTime = new Date();
  private intervalId?: ReturnType<typeof setInterval>;

  constructor(private queueService: QueueService) {}

  ngOnInit() {
    this.loadQueue();
    this.intervalId = setInterval(() => {
      this.loadQueue();
      this.currentTime = new Date();
    }, 5000);
  }

  ngOnDestroy() {
    if (this.intervalId) clearInterval(this.intervalId);
  }

  loadQueue() {
    this.queueService.getPublicDisplayQueue().subscribe({
      next: (data) => {
        this.queueEntries = data;
        this.updateDisplay();
      }
    });
  }

  statusLabel(status: string): string {
    const map: Record<string, string> = {
      CALLED: 'เรียกแล้ว กรุณาเข้าพบ',
      IN_SERVICE: 'กำลังให้บริการ'
    };
    return map[status] || status;
  }

  private updateDisplay() {
    const called = this.queueEntries.find(q => q.status === 'CALLED');
    const inService = this.queueEntries.find(q => q.status === 'IN_SERVICE');
    this.currentQueue = called || inService || null;
    this.waitingQueues = this.queueEntries.filter(q => q.status === 'WAITING').slice(0, 12);
  }
}
