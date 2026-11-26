import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { QueueEntry } from '../models/queue.model';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class QueueService {
  private apiUrl = `${environment.apiUrl}/queue`;

  constructor(private http: HttpClient) { }

  getTodayQueue(): Observable<QueueEntry[]> {
    return this.http.get<QueueEntry[]>(`${this.apiUrl}/today`);
  }

  getQueueByDate(date: string): Observable<QueueEntry[]> {
    const params = new HttpParams().set('date', date);
    return this.http.get<QueueEntry[]>(this.apiUrl, { params });
  }

  getPublicDisplayQueue(): Observable<QueueEntry[]> {
    return this.http.get<QueueEntry[]>(`${this.apiUrl}/display/today`);
  }

  createQueueEntry(patientId: number, notes?: string): Observable<QueueEntry> {
    return this.http.post<QueueEntry>(this.apiUrl, { patientId, notes });
  }

  callNext(): Observable<QueueEntry> {
    return this.http.post<QueueEntry>(`${this.apiUrl}/call-next`, {});
  }

  updateQueueStatus(id: number, status: string): Observable<QueueEntry> {
    return this.http.patch<QueueEntry>(`${this.apiUrl}/${id}/status`, { status });
  }
}
