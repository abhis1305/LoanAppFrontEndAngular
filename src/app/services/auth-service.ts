import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';

export class AuthResponse {
  requiresTwoFactor?: boolean;
  requiresTwoFactorSetup?: boolean;
  setupToken?: string | null;
  preAuthToken?: string | null;
  token?: string | null;
  role?: string | null;
  message?: string;
}

export class TwoFactorSetupResponse {
  manualEntryKey?: string;
  qrCodeUri?: string;
  message?: string;
}

export class ApiMessageResponse {
  message?: string;
}

export class LoginFlowResult {
  status: 'setup' | 'twoFactor' | 'authenticated' | 'error' = 'error';
  message?: string;
}

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private http = inject(HttpClient);
  private router = inject(Router);

  private readonly apiUrl = 'http://localhost:7008/api/Auth';
  private readonly googleClientId =
    '1066832090441-qbqpblqu0ksr8dgau73pklpr57boheuf.apps.googleusercontent.com';

  register(data: any): Observable<ApiMessageResponse> {
    return this.http.post<ApiMessageResponse>(`${this.apiUrl}/register`, data);
  }

  login(data: any): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${this.apiUrl}/login`, data);
  }

  getGoogleClientId(): string {
    return this.googleClientId;
  }

  googleLogin(idToken: string): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${this.apiUrl}/google`, {
      idToken: idToken,
    });
  }

  enableTwoFactor(setupToken: string): Observable<TwoFactorSetupResponse> {
    const headers = new HttpHeaders({
      Authorization: `Bearer ${setupToken}`,
    });
    return this.http.post<TwoFactorSetupResponse>(`${this.apiUrl}/enable-2fa`, {}, { headers });
  }

  verifyTwoFactor(preAuthToken: string, code: string): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${this.apiUrl}/verify-2fa`, {
      preAuthToken,
      code,
    });
  }

  handleLoginResponse(response: AuthResponse): LoginFlowResult {
    const result = new LoginFlowResult();

    if (response.requiresTwoFactorSetup) {
      if (!response.setupToken) {
        result.status = 'error';
        result.message = 'Setup token was not returned by the server.';
        return result;
      }
      this.clearAuthData();
      sessionStorage.setItem('setupToken', response.setupToken);
      void this.router.navigate(['/two-factor-setup']);
      result.status = 'setup';
      return result;
    }

    if (response.requiresTwoFactor) {
      if (!response.preAuthToken) {
        result.status = 'error';
        result.message = 'Pre-authentication token was not returned.';
        return result;
      }
      this.clearAuthData();
      sessionStorage.setItem('preAuthToken', response.preAuthToken);
      result.status = 'twoFactor';
      result.message = 'Enter the 6-digit code from your Authenticator app.';
      return result;
    }

    if (response.token) {
      const success = this.completeLogin(response.token, response.role);
      if (success) {
        result.status = 'authenticated';
        return result;
      }
      result.status = 'error';
      result.message = 'Login succeeded, but the role is missing or unrecognized.';
      return result;
    }

    result.status = 'error';
    result.message = response.message || 'Login failed.';
    return result;
  }

  completeTwoFactorLogin(response: AuthResponse): boolean {
    if (!response.token) {
      return false;
    }
    return this.completeLogin(response.token, response.role);
  }

  completeSetupLogin(response: AuthResponse): boolean {
    if (!response.token) {
      return false;
    }
    return this.completeLogin(response.token, response.role);
  }

  private completeLogin(token: string, responseRole?: string | null): boolean {
    // FIXED: Stripped casing inconsistencies to match 'customer' or 'officer' safely
    const role = (responseRole || this.getRoleFromToken(token)).trim().toLowerCase();
    let dashboardRoute = '';

 if (role?.toLowerCase() === 'user' || role?.toLowerCase() === 'customer') {
  dashboardRoute = '/user-dashboard';
} else if (role?.toLowerCase() === 'loan officer' || role?.toLowerCase() === 'officer') {
  dashboardRoute = '/officer-dashboard';
} else if (role?.toLowerCase() === 'admin') {
  dashboardRoute = '/admin-dashboard';
} else {
  return false;
}
    this.clearAuthData();
    sessionStorage.setItem('accessToken', token);
    sessionStorage.setItem('userRole', role);

    void this.router.navigate([dashboardRoute]);
    return true;
  }

  private getRoleFromToken(token: string): string {
    try {
      const payload = token.split('.')[1].replace(/-/g, '+').replace(/_/g, '/');
      const paddedPayload = payload.padEnd(payload.length + ((4 - (payload.length % 4)) % 4), '=');
      const claims = JSON.parse(atob(paddedPayload));
      const role =
        claims['role'] ??
        claims['roles'] ??
        claims['http://schemas.microsoft.com/ws/2008/06/identity/claims/role'];

      return Array.isArray(role) ? (role[0] ?? '') : (role ?? '');
    } catch {
      return '';
    }
  }

  // ADDED: Token payload claim decoder
  getData(): any {
    const token = this.getAccessToken();
    if (!token) return null;
    try {
      const payload = token.split('.')[1].replace(/-/g, '+').replace(/_/g, '/');
      const paddedPayload = payload.padEnd(payload.length + ((4 - (payload.length % 4)) % 4), '=');
      return JSON.parse(atob(paddedPayload));
    } catch {
      return null;
    }
  }

  // ADDED: Returns the user name claim for dashboards
  getName(): string {
    const d = this.getData();
    if (!d) return '';
    return d['unique_name'] || d['name'] 
        || d['http://xmlsoap.org'] || '';
  }

  // ADDED: Resolves the missing property compilation error inside support.ts
  getCustomerId(): number {
    const d = this.getData();
    if (!d) return 0;
    return Number(d['customerId'] || d['nameid']
        || d['http://xmlsoap.orgidentifier'] || 0);
  }

  getAccessToken(): string | null {
    return sessionStorage.getItem('accessToken');
  }

  getCurrentRole(): string | null {
    return sessionStorage.getItem('userRole');
  }

  isLoggedIn(): boolean {
    return !!this.getAccessToken();
  }

  logout(): void {
    this.clearAuthData();
    void this.router.navigate(['/login']);
  }

  private clearAuthData(): void {
    sessionStorage.removeItem('accessToken');
    sessionStorage.removeItem('userRole');
    sessionStorage.removeItem('setupToken');
    sessionStorage.removeItem('preAuthToken');
  }
}