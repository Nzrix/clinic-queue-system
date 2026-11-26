import { Routes } from '@angular/router';
import { authGuard } from './guards/auth.guard';

export const routes: Routes = [
  {
    path: 'login',
    loadComponent: () => import('./components/login/login.component').then(m => m.LoginComponent)
  },
  {
    path: 'queue-display',
    loadComponent: () => import('./components/queue-display/queue-display.component').then(m => m.QueueDisplayComponent)
  },
  {
    path: '',
    canActivate: [authGuard],
    children: [
      {
        path: 'dashboard',
        loadComponent: () => import('./components/dashboard/dashboard.component').then(m => m.DashboardComponent)
      },
      {
        path: 'patients',
        loadComponent: () => import('./components/patients/patients.component').then(m => m.PatientsComponent)
      },
      {
        path: 'appointments',
        loadComponent: () => import('./components/appointments/appointments.component').then(m => m.AppointmentsComponent)
      },
      {
        path: 'queue',
        loadComponent: () => import('./components/queue/queue.component').then(m => m.QueueComponent)
      },
      {
        path: '',
        redirectTo: 'dashboard',
        pathMatch: 'full'
      }
    ]
  },
  {
    path: '**',
    redirectTo: ''
  }
];
