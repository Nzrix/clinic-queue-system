import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { AuthService } from './auth.service';
import { LoginRequest, LoginResponse } from '../models/auth.model';
import { environment } from '../../environments/environment';

describe('AuthService', () => {
  let service: AuthService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [AuthService]
    });
    service = TestBed.inject(AuthService);
    httpMock = TestBed.inject(HttpTestingController);
    localStorage.clear();
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should login successfully', () => {
    const mockRequest: LoginRequest = {
      username: 'demo',
      password: 'demo123'
    };

    const mockResponse: LoginResponse = {
      token: 'test-token',
      username: 'demo',
      fullName: 'สมชาย ใจดี',
      role: 'STAFF'
    };

    service.login(mockRequest).subscribe(response => {
      expect(response).toEqual(mockResponse);
      expect(localStorage.getItem('auth_token')).toBe('test-token');
      expect(service.isAuthenticated()).toBe(true);
    });

    const req = httpMock.expectOne(`${environment.apiUrl}/auth/login`);
    expect(req.request.method).toBe('POST');
    req.flush(mockResponse);
  });

  it('should logout and clear storage', () => {
    localStorage.setItem('auth_token', 'test-token');
    localStorage.setItem('auth_user', JSON.stringify({ username: 'demo' }));

    service.logout();

    expect(localStorage.getItem('auth_token')).toBeNull();
    expect(localStorage.getItem('auth_user')).toBeNull();
    expect(service.isAuthenticated()).toBe(false);
  });

  it('should return token from storage', () => {
    localStorage.setItem('auth_token', 'test-token');
    expect(service.getToken()).toBe('test-token');
  });

  it('should check authentication status', () => {
    expect(service.isAuthenticated()).toBe(false);
    
    localStorage.setItem('auth_token', 'test-token');
    expect(service.isAuthenticated()).toBe(true);
  });
});
