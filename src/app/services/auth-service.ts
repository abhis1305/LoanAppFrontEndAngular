
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

  // Updated to match the HTTPS backend URL in launchSettings.json
  private readonly apiUrl = 'https://localhost:7008/api/Auth';

  private readonly googleClientId =
    '1066832090441-qbqpblqu0ksr8dgau73pklpr57boheuf.apps.googleusercontent.com';

  register(data: any): Observable<ApiMessageResponse> {
    return this.http.post<ApiMessageResponse>(
      `${this.apiUrl}/register`,
      data
    );
  }

  login(data: any): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(
      `${this.apiUrl}/login`,
      data
    );
  }

  getGoogleClientId(): string {
    return this.googleClientId;
  }

  googleLogin(idToken: string): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(
      `${this.apiUrl}/google`,
      { idToken }
    );
  }

  enableTwoFactor(
    setupToken: string
  ): Observable<TwoFactorSetupResponse> {
    const headers = new HttpHeaders({
      Authorization: `Bearer ${setupToken}`,
    });

    return this.http.post<TwoFactorSetupResponse>(
      `${this.apiUrl}/enable-2fa`,
      {},
      { headers }
    );
  }

  verifyTwoFactor(
    preAuthToken: string,
    code: string
  ): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(
      `${this.apiUrl}/verify-2fa`,
      { preAuthToken, code }
    );
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
      const success = this.completeLogin(
        response.token,
        response.role
      );

      if (success) {
        result.status = 'authenticated';
        return result;
      }

      result.status = 'error';
      result.message =
        'Login succeeded, but the role is missing or unrecognized.';
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

  private completeLogin(
    token: string,
    responseRole?: string | null
  ): boolean {
    const role = (
      responseRole || this.getRoleFromToken(token)
    ).trim().toLowerCase();

    let dashboardRoute = '';

    if (role === 'user' || role === 'customer') {
      dashboardRoute = '/user-dashboard';
    } else if (role === 'loan officer' || role === 'officer') {
      dashboardRoute = '/officer-dashboard';
    } else if (role === 'admin') {
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
      const payload = token
        .split('.')[1]
        .replace(/-/g, '+')
        .replace(/_/g, '/');

      const paddedPayload = payload.padEnd(
        payload.length + ((4 - (payload.length % 4)) % 4),
        '='
      );

      const claims = JSON.parse(atob(paddedPayload));

      const role =
        claims['role'] ??
        claims['roles'] ??
        claims[
          'http://schemas.microsoft.com/ws/2008/06/identity/claims/role'
        ];

      return Array.isArray(role) ? (role[0] ?? '') : (role ?? '');
    } catch {
      return '';
    }
  }

  getData(): any {
    const token = this.getAccessToken();

    if (!token) {
      return null;
    }

    try {
      const payload = token
        .split('.')[1]
        .replace(/-/g, '+')
        .replace(/_/g, '/');

      const paddedPayload = payload.padEnd(
        payload.length + ((4 - (payload.length % 4)) % 4),
        '='
      );

      return JSON.parse(atob(paddedPayload));
    } catch {
      return null;
    }
  }

  getName(): string {
    const data = this.getData();

    if (!data) {
      return '';
    }

    return (
      data['unique_name'] ||
      data['name'] ||
      data['http://schemas.xmlsoap.org/ws/2005/05/identity/claims/name'] ||
      ''
    );
  }

 
 getCustomerId(): number {
  const data = this.getData();

  if (!data) {
    return 0;
  }

  const value =
    data['customerId'] ??
    data['CustomerId'] ??
    data['customer_id'] ??
    data['nameid'] ??
    data[
      'http://schemas.xmlsoap.org/ws/2005/05/identity/claims/nameidentifier'
    ];

  if (value === undefined || value === null || value === '') {
    console.error(
      'Customer ID claim is missing from the JWT.',
      data
    );
    return 0;
  }

  const id = Number(value);

  return Number.isSafeInteger(id) && id > 0 ? id : 0;
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
