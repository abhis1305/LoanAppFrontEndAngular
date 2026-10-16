import { Component } from '@angular/core';
import { RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
// keep the import path that already works for your folder:
//   folder directly in src/app  -> '../services/auth-service'
//   folder inside src/app/pages -> '../../services/auth-service'
import { AuthService } from '../../services/auth-service';

@Component({
  selector: 'app-customer-layout',
  imports: [RouterOutlet, RouterLink, RouterLinkActive],
  templateUrl: './customer-layout.html',
  styleUrl: './customer-layout.scss',
})
export class CustomerLayout {
  name: string;
  collapsed = false;
  menuOpen = false;

  // link = a route that exists today. Items with link '' show as "coming soon".
  // To switch one on later: put its route path in link and add the route in app.routes.ts
  nav = [
    { icon: 'bi-house-door', text: 'Dashboard', link: '/user-dashboard' },
    { icon: 'bi-file-earmark-text', text: 'My Applications', link: '' },
    { icon: 'bi-wallet2', text: 'My Loans', link: '' },
    { icon: 'bi-person-vcard', text: 'KYC Documents', link: '/customer-kyc' },
    { icon: 'bi-credit-card-2-front', text: 'EMI Payments', link: '' },
    { icon: 'bi-clock-history', text: 'Payment History', link: '' },
    { icon: 'bi-folder2-open', text: 'Documents', link: '' },
    { icon: 'bi-person', text: 'Profile Settings', link: '' },
    { icon: 'bi-bell', text: 'Alerts & Messages', link: '' },
    { icon: 'bi-headset', text: 'Support / Raise Query', link: '/support' },
    { icon: 'bi-gift', text: 'Refer & Earn', link: '' },
  ];

  constructor(private auth: AuthService) {
    this.name = this.auth.getName() || 'Customer';
  }

  get initials() {
    return this.name.split(' ').map(w => w[0]).join('').slice(0, 2).toUpperCase();
  }

  logout() {
    this.auth.logout();
  }
}