import { Component, OnInit, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterOutlet, RouterLink, RouterLinkActive, NavigationEnd } from '@angular/router';
import { filter } from 'rxjs/operators';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatSidenavModule, MatSidenav } from '@angular/material/sidenav';
import { MatListModule } from '@angular/material/list';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { AuthService } from './services/auth.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    CommonModule,
    RouterOutlet,
    RouterLink,
    RouterLinkActive,
    MatToolbarModule,
    MatSidenavModule,
    MatListModule,
    MatIconModule,
    MatButtonModule
  ],
  template: `
    <ng-container *ngIf="isShellRoute; else bare">
      <mat-sidenav-container class="shell">
        <mat-sidenav
          #drawer
          class="shell-sidenav"
          [mode]="isHandset ? 'over' : 'side'"
          [opened]="!isHandset && isAuthenticated">
          <div class="brand">
            <mat-icon>local_hospital</mat-icon>
            <div>
              <strong>Clinic Queue</strong>
              <span>ระบบคิว & นัดหมาย</span>
            </div>
          </div>
          <mat-nav-list>
            <a mat-list-item routerLink="/dashboard" routerLinkActive="active" (click)="closeIfHandset()">
              <mat-icon matListItemIcon>dashboard</mat-icon>
              <span matListItemTitle>แดชบอร์ด</span>
            </a>
            <a mat-list-item routerLink="/patients" routerLinkActive="active" (click)="closeIfHandset()">
              <mat-icon matListItemIcon>groups</mat-icon>
              <span matListItemTitle>ผู้ป่วย</span>
            </a>
            <a mat-list-item routerLink="/appointments" routerLinkActive="active" (click)="closeIfHandset()">
              <mat-icon matListItemIcon>event</mat-icon>
              <span matListItemTitle>นัดหมาย</span>
            </a>
            <a mat-list-item routerLink="/queue" routerLinkActive="active" (click)="closeIfHandset()">
              <mat-icon matListItemIcon>queue</mat-icon>
              <span matListItemTitle>คิว Walk-in</span>
            </a>
            <a mat-list-item routerLink="/queue-display" target="_blank" rel="noopener">
              <mat-icon matListItemIcon>tv</mat-icon>
              <span matListItemTitle>จอแสดงคิว</span>
            </a>
          </mat-nav-list>
        </mat-sidenav>

        <mat-sidenav-content>
          <mat-toolbar color="primary" class="shell-toolbar" *ngIf="isAuthenticated">
            <button mat-icon-button type="button" (click)="drawer.toggle()" aria-label="เมนู">
              <mat-icon>menu</mat-icon>
            </button>
            <span class="toolbar-title">{{ pageTitle }}</span>
            <span class="spacer"></span>
            <span class="user-chip" *ngIf="currentUser">
              <mat-icon>account_circle</mat-icon>
              {{ currentUser.fullName }}
            </span>
            <button mat-stroked-button type="button" (click)="logout()">
              <mat-icon>logout</mat-icon>
              ออกจากระบบ
            </button>
          </mat-toolbar>
          <main class="shell-main">
            <router-outlet></router-outlet>
          </main>
        </mat-sidenav-content>
      </mat-sidenav-container>
    </ng-container>

    <ng-template #bare>
      <router-outlet></router-outlet>
    </ng-template>
  `,
  styles: [`
    .shell {
      min-height: 100vh;
      background: transparent;
    }

    .shell-sidenav {
      width: 260px;
      border-right: 1px solid var(--clinic-border);
      background: #ffffff;
    }

    .brand {
      display: flex;
      gap: 12px;
      align-items: center;
      padding: 24px 20px 16px;
      border-bottom: 1px solid var(--clinic-border);
    }

    .brand mat-icon {
      color: var(--clinic-primary);
      font-size: 32px;
      width: 32px;
      height: 32px;
    }

    .brand strong {
      display: block;
      font-size: 1rem;
    }

    .brand span {
      display: block;
      color: var(--clinic-muted);
      font-size: 0.8rem;
    }

    .shell-toolbar {
      position: sticky;
      top: 0;
      z-index: 2;
      gap: 8px;
    }

    .toolbar-title {
      font-weight: 600;
      margin-left: 4px;
    }

    .spacer { flex: 1; }

    .user-chip {
      display: inline-flex;
      align-items: center;
      gap: 6px;
      margin-right: 8px;
      opacity: 0.95;
    }

    .shell-main {
      min-height: calc(100vh - 64px);
    }

    a.active {
      background: var(--clinic-primary-soft);
      color: var(--clinic-primary);
    }

    @media (max-width: 768px) {
      .user-chip span, .user-chip {
        display: none;
      }
    }
  `]
})
export class AppComponent implements OnInit {
  @ViewChild('drawer') drawer?: MatSidenav;

  isAuthenticated = false;
  currentUser: any = null;
  isHandset = false;
  isShellRoute = true;
  pageTitle = 'แดชบอร์ด';

  private titles: Record<string, string> = {
    '/dashboard': 'แดชบอร์ด',
    '/patients': 'จัดการผู้ป่วย',
    '/appointments': 'นัดหมาย',
    '/queue': 'คิว Walk-in'
  };

  constructor(
    private authService: AuthService,
    private router: Router,
    private breakpointObserver: BreakpointObserver
  ) {}

  ngOnInit() {
    this.breakpointObserver.observe([Breakpoints.Handset]).subscribe(result => {
      this.isHandset = result.matches;
    });

    this.authService.currentUser$.subscribe(user => {
      this.isAuthenticated = !!user;
      this.currentUser = user;
      if (!user && !this.isPublicRoute(this.router.url)) {
        this.router.navigate(['/login']);
      }
    });

    this.router.events.pipe(filter(e => e instanceof NavigationEnd)).subscribe((e: any) => {
      const url = e.urlAfterRedirects || e.url;
      this.isShellRoute = !this.isPublicRoute(url);
      this.pageTitle = this.titles[url.split('?')[0]] || 'Clinic Queue';
    });

    this.isShellRoute = !this.isPublicRoute(this.router.url);
  }

  isPublicRoute(url: string): boolean {
    return url.startsWith('/login') || url.startsWith('/queue-display');
  }

  closeIfHandset() {
    if (this.isHandset) {
      this.drawer?.close();
    }
  }

  logout() {
    this.authService.logout();
    this.router.navigate(['/login']);
  }
}
