import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterOutlet, RouterLink } from '@angular/router';
import { AuthService } from './services/auth.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, RouterOutlet, RouterLink],
  template: `
    <div class="app">
      <nav class="navbar" *ngIf="isAuthenticated">
        <div class="container">
          <div class="nav-brand">
            <h2>ระบบจัดการคิวและนัดหมาย</h2>
          </div>
          <div class="nav-menu">
            <a routerLink="/dashboard" routerLinkActive="active">แดชบอร์ด</a>
            <a routerLink="/patients" routerLinkActive="active">ผู้ป่วย</a>
            <a routerLink="/appointments" routerLinkActive="active">นัดหมาย</a>
            <a routerLink="/queue" routerLinkActive="active">คิวรอ</a>
            <a routerLink="/queue-display" target="_blank">จอแสดงคิว</a>
          </div>
          <div class="nav-user">
            <span>{{ currentUser?.fullName }}</span>
            <button class="btn btn-secondary" (click)="logout()">ออกจากระบบ</button>
          </div>
        </div>
      </nav>
      <main>
        <router-outlet></router-outlet>
      </main>
    </div>
  `,
  styles: [`
    .navbar {
      background-color: #2c3e50;
      color: white;
      padding: 15px 0;
      box-shadow: 0 2px 4px rgba(0,0,0,0.1);
    }

    .navbar .container {
      display: flex;
      justify-content: space-between;
      align-items: center;
    }

    .nav-brand h2 {
      margin: 0;
      font-size: 20px;
    }

    .nav-menu {
      display: flex;
      gap: 20px;
    }

    .nav-menu a {
      color: white;
      text-decoration: none;
      padding: 8px 16px;
      border-radius: 4px;
      transition: background-color 0.3s;
    }

    .nav-menu a:hover {
      background-color: #34495e;
    }

    .nav-menu a.active {
      background-color: #3498db;
    }

    .nav-user {
      display: flex;
      align-items: center;
      gap: 15px;
    }

    main {
      min-height: calc(100vh - 70px);
    }
  `]
})
export class AppComponent implements OnInit {
  isAuthenticated = false;
  currentUser: any = null;

  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit() {
    this.authService.currentUser$.subscribe(user => {
      this.isAuthenticated = !!user;
      this.currentUser = user;
      
      if (!user && this.router.url !== '/login' && this.router.url !== '/queue-display') {
        this.router.navigate(['/login']);
      }
    });
  }

  logout() {
    this.authService.logout();
    this.router.navigate(['/login']);
  }
}
