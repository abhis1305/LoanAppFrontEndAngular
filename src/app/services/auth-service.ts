
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

  private readonly apiUrl = 'https://localhost:7008/api/Auth';

  private readonly googleClientId =
    '1066832090441-qbqpblqu0ksr8dgau73pklpr57boheuf.apps.googleusercontent.com';

  // =========================
  // REGISTER
  // =========================
  register(data: any): Observable<ApiMessageResponse> {
    return this.http.post<ApiMessageResponse>(
      `${this.apiUrl}/register`,
      data
    );
  }

  // =========================
  // LOGIN
  // =========================
  login(data: any): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(
      `${this.apiUrl}/login`,
      data
    );
  }

  // =========================
  // GOOGLE LOGIN
  // =========================
  getGoogleClientId(): string {
    return this.googleClientId;
  }

  googleLogin(idToken: string): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(
      `${this.apiUrl}/google`,
      { idToken }
    );
  }

  // =========================
  // TWO-FACTOR SETUP
  // =========================
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

  // =========================
  // VERIFY TWO-FACTOR CODE
  // =========================
  verifyTwoFactor(
    preAuthToken: string,
    code: string
  ): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(
      `${this.apiUrl}/verify-2fa`,
      { preAuthToken, code }
    );
  }

  // =========================
  // HANDLE LOGIN RESPONSE
  // =========================
  handleLoginResponse(response: AuthResponse): LoginFlowResult {
    const result = new LoginFlowResult();

    // First-time 2FA setup
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

    // Existing 2FA verification required
    if (response.requiresTwoFactor) {
      if (!response.preAuthToken) {
        result.status = 'error';
        result.message = 'Pre-authentication token was not returned.';
        return result;
      }

      this.clearAuthData();

      sessionStorage.setItem('preAuthToken', response.preAuthToken);

      result.status = 'twoFactor';
      result.message =
        'Enter the 6-digit code from your Authenticator app.';

      return result;
    }

    // Normal login without 2FA
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

  // =========================
  // COMPLETE TWO-FACTOR LOGIN
  // =========================
  completeTwoFactorLogin(response: AuthResponse): boolean {
    if (!response.token) {
      return false;
    }

    return this.completeLogin(response.token, response.role);
  }

  // =========================
  // COMPLETE SETUP LOGIN
  // =========================
  completeSetupLogin(response: AuthResponse): boolean {
    if (!response.token) {
      return false;
    }

    return this.completeLogin(response.token, response.role);
  }

  // =========================
  // ROLE-BASED NAVIGATION
  // =========================
  private completeLogin(
    token: string,
    responseRole?: string | null
  ): boolean {
    const role = String(
      responseRole || this.getRoleFromToken(token)
    )
      .trim()
      .toLowerCase();

    let dashboardRoute = '';

    if (role === 'user' || role === 'customer') {
      dashboardRoute = '/user-dashboard';
    } else if (
      role === 'loan officer' ||
      role === 'loan_officer' ||
      role === 'officer'
    ) {
      dashboardRoute = '/officer-dashboard';
    } else if (role === 'admin' || role === 'administrator') {
      // Admin pages currently use the OfficerLayout routes.
      dashboardRoute = '/officer-dashboard';
    } else {
      return false;
    }

    this.clearAuthData();

    sessionStorage.setItem('accessToken', token);
    sessionStorage.setItem('userRole', role);

    void this.router.navigate([dashboardRoute]);

    return true;
  }

  // =========================
  // EXTRACT ROLE FROM JWT
  // =========================
  private getRoleFromToken(token: string): string {
    const claims = this.decodeToken(token);

    if (!claims) {
      return '';
    }

    const role =
      claims['role'] ??
      claims['roles'] ??
      claims[
        'http://schemas.microsoft.com/ws/2008/06/identity/claims/role'
      ];

    if (Array.isArray(role)) {
      return String(role[0] ?? '');
    }

    return String(role ?? '');
  }

  // =========================
  // DECODE JWT PAYLOAD
  // =========================
  private decodeToken(token: string): any | null {
    try {
      const parts = token.split('.');

      if (parts.length !== 3) {
        return null;
      }

      const payload = parts[1]
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

  // =========================
  // GET CURRENT USER DATA
  // =========================
  getData(): any {
    const token = this.getAccessToken();

    if (!token) {
      return null;
    }

    return this.decodeToken(token);
  }

  // =========================
  // GET LOGGED-IN USER NAME
  // =========================
  getName(): string {
    const data = this.getData();

    if (!data) {
      return '';
    }

    return (
      data['unique_name'] ||
      data['name'] ||
      data[
        'http://schemas.xmlsoap.org/ws/2005/05/identity/claims/name'
      ] ||
      ''
    );
  }

  // =========================
  // GET LOGGED-IN CUSTOMER ID
  // =========================
  getCustomerId(): number {
    const data = this.getData();

    if (!data) {
      return 0;
    }

    const value =
      data['customerId'] ??
      data['CustomerId'] ??
      data['customer_id'] ??
      data['userId'] ??
      data['UserId'] ??
      data['user_id'] ??
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

  // =========================
  // DEBUG JWT CLAIMS
  // =========================
  debugTokenClaims(): void {
    const data = this.getData();

    console.log(
      'JWT claim names:',
      data ? Object.keys(data) : 'No token'
    );

    console.log('JWT decoded data:', data);
    console.log('Customer ID:', this.getCustomerId());
    console.log('User name:', this.getName());
    console.log('Current role:', this.getCurrentRole());
  }

  // =========================
  // ACCESS TOKEN
  // =========================
  getAccessToken(): string | null {
    return sessionStorage.getItem('accessToken');
  }

  // =========================
  // CURRENT ROLE
  // =========================
  getCurrentRole(): string | null {
    return sessionStorage.getItem('userRole');
  }

  // =========================
  // LOGIN STATUS
  // =========================
  isLoggedIn(): boolean {
    return !!this.getAccessToken();
  }

  // =========================
  // LOGOUT
  // =========================
  logout(): void {
    this.clearAuthData();

    void this.router.navigate(['/login']);
  }

  // =========================
  // CLEAR AUTH DATA
  // =========================
  private clearAuthData(): void {
    sessionStorage.removeItem('accessToken');
    sessionStorage.removeItem('userRole');
    sessionStorage.removeItem('setupToken');
    sessionStorage.removeItem('preAuthToken');
  }
}
