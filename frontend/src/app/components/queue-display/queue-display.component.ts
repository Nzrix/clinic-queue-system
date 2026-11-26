import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { QueueService } from '../../services/queue.service';
import { QueueEntry } from '../../models/queue.model';

@Component({
  selector: 'app-queue-display',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="display-container">
      <div class="header">
        <h1>คิวปัจจุบัน</h1>
        <div class="time">{{ currentTime | date:'HH:mm:ss' }}</div>
      </div>
      
      <div class="current-queue" *ngIf="currentQueue">
        <div class="queue-label">กำลังเรียก</div>
        <div class="queue-number-large">{{ currentQueue.queueNumber }}</div>
        <div class="patient-name">{{ currentQueue.patientName }}</div>
      </div>
      
      <div class="waiting-section">
        <h2>คิวรอ</h2>
        <div class="waiting-grid">
          <div class="waiting-queue" *ngFor="let entry of waitingQueues">
            <div class="queue-number-small">{{ entry.queueNumber }}</div>
          </div>
        </div>
        <div *ngIf="waitingQueues.length === 0" class="no-waiting">
          ไม่มีคิวที่รอ
        </div>
      </div>
    </div>
  `,
  styles: [`
    .display-container {
      min-height: 100vh;
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      padding: 40px;
      color: white;
    }

    .header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 40px;
    }

    .header h1 {
      font-size: 48px;
      margin: 0;
    }

    .time {
      font-size: 32px;
      font-weight: 300;
    }

    .current-queue {
      background: rgba(255, 255, 255, 0.95);
      border-radius: 20px;
      padding: 60px;
      text-align: center;
      margin-bottom: 40px;
      box-shadow: 0 10px 40px rgba(0, 0, 0, 0.3);
    }

    .queue-label {
      font-size: 32px;
      color: #2c3e50;
      margin-bottom: 20px;
      font-weight: 500;
    }

    .queue-number-large {
      font-size: 160px;
      font-weight: bold;
      color: #3498db;
      line-height: 1;
      margin: 20px 0;
    }

    .patient-name {
      font-size: 48px;
      color: #2c3e50;
      font-weight: 500;
    }

    .waiting-section {
      background: rgba(255, 255, 255, 0.1);
      border-radius: 20px;
      padding: 40px;
    }

    .waiting-section h2 {
      font-size: 36px;
      margin-bottom: 30px;
    }

    .waiting-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(120px, 1fr));
      gap: 20px;
    }

    .waiting-queue {
      background: rgba(255, 255, 255, 0.9);
      border-radius: 12px;
      padding: 20px;
      text-align: center;
    }

    .queue-number-small {
      font-size: 48px;
      font-weight: bold;
      color: #3498db;
    }

    .no-waiting {
      text-align: center;
      font-size: 24px;
      padding: 40px;
      opacity: 0.8;
    }
  `]
})
export class QueueDisplayComponent implements OnInit, OnDestroy {
  queueEntries: QueueEntry[] = [];
  currentQueue: QueueEntry | null = null;
  waitingQueues: QueueEntry[] = [];
  currentTime = new Date();
  private intervalId: any;

  constructor(private queueService: QueueService) {}

  ngOnInit() {
    this.loadQueue();
    
    this.intervalId = setInterval(() => {
      this.loadQueue();
      this.currentTime = new Date();
    }, 5000);
  }

  ngOnDestroy() {
    if (this.intervalId) {
      clearInterval(this.intervalId);
    }
  }

  loadQueue() {
    this.queueService.getPublicDisplayQueue().subscribe({
      next: (data) => {
        this.queueEntries = data;
        this.updateDisplay();
      },
      error: (err) => {
        console.error('Error loading queue:', err);
      }
    });
  }

  private updateDisplay() {
    const called = this.queueEntries.find(q => q.status === 'CALLED');
    const inService = this.queueEntries.find(q => q.status === 'IN_SERVICE');
    
    this.currentQueue = called || inService || null;
    this.waitingQueues = this.queueEntries.filter(q => q.status === 'WAITING');
  }
}
