import { Component } from '@angular/core';
import { RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { AuthService } from '../services/auth-service';

@Component({
  selector: 'app-officer-layout',
  imports: [RouterOutlet, RouterLink, RouterLinkActive],
  templateUrl: './officer-layout.html',
  styleUrl: './officer-layout.scss',
})
export class OfficerLayout {
  name: string;
  collapsed = false;
  menuOpen = false;

  // link = a route that exists today. Items with link '' show as "coming soon".
  // To switch one on later: put its route path in link and add the route in app.routes.ts
  groups = [
    {
      title: 'Loan origination',
      items: [
        { icon: 'bi-speedometer2', text: 'Dashboard', link: '/officer-dashboard' },
        { icon: 'bi-file-earmark-text', text: 'Applications', link: '' },
        { icon: 'bi-person-vcard', text: 'KYC Verification', link: '/officer-kyc' },
        { icon: 'bi-graph-up-arrow', text: 'CIBIL / Credit Check', link: '/cibil' },
        { icon: 'bi-check2-square', text: 'Eligibility', link: '/eligibility' },
        { icon: 'bi-bar-chart-steps', text: 'Score Card', link: '/scorecard' },
      ],
    },
    {
      title: 'Loan management',
      items: [
        { icon: 'bi-journal-text', text: 'Loans', link: '' },
        { icon: 'bi-calendar-check', text: 'EMI Management', link: '' },
        { icon: 'bi-cash-coin', text: 'Collections', link: '' },
        { icon: 'bi-credit-card-2-front', text: 'Payments', link: '' },
        { icon: 'bi-exclamation-triangle', text: 'NPA Management', link: '' },
      ],
    },
    {
      title: 'Service and admin',
      items: [
        { icon: 'bi-headset', text: 'Support Tickets', link: '' },
        { icon: 'bi-pie-chart', text: 'Support Reports', link: '' },
        { icon: 'bi-clipboard-data', text: 'Audit Trail', link: '' },
        { icon: 'bi-gear', text: 'Settings', link: '' },
      ],
    },
  ];

  constructor(private auth: AuthService) {
    this.name = this.auth.getName() || 'Officer';
  }

  get initials() {
    return this.name.split(' ').map(w => w[0]).join('').slice(0, 2).toUpperCase();
  }

  logout() {
    this.auth.logout();
  }
}