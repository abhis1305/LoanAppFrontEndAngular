import { ChangeDetectorRef, Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { DashboardService } from '../../services/dashboard-service';
import { AuthService } from '../../services/auth-service';

// OFFICER dashboard: LOS + LMS together   (role: Loan Officer)
@Component({
  imports: [CommonModule, ReactiveFormsModule],
  selector: 'app-officer-dashboard',
  styleUrl: './officer-dashboard.scss',
  templateUrl: './officer-dashboard.html',
})
export class OfficerDashboard {
  name: any;

  constructor(private service: DashboardService, private auth: AuthService, private cd: ChangeDetectorRef)
  {
    this.name = this.auth.getName() || 'Officer';
    this.getDashboard();
  }

  // optional date range (funnel and collection efficiency use it)
  filter = new FormGroup({
    from: new FormControl(''),
    to: new FormControl(''),
  });

  colors = ['#1565d8', '#fd7e14', '#198754', '#dc3545', '#6f42c1', '#20c997'];        // portfolio donut
  funnelColors = ['#2f80ed', '#4fa3e8', '#5cb85c', '#2e9e57', '#17a589'];            // funnel segments
  yLabels = [100, 80, 60, 40, 20, 0];                                                  // collection chart axis

  dash: any;
  msg = "";
  loading = true;
  funnel: any[] = [];
  portfolioDonut = "";
  totalOutstanding = 0;

  getDashboard()
  {
    var f: any = this.filter.value.from || "";
    var t: any = this.filter.value.to || "";
    this.loading = true;

    this.service.getOfficerDashboard(f, t).subscribe({
      next: (res: any) => {
        this.dash = res;
        this.msg = "";
        this.loading = false;
        this.buildFunnel(res.funnel || []);
        this.buildDonut(res.portfolioSummary || []);
        this.cd.detectChanges();
      },
      error: (err: any) => {
        console.log(err);
        this.loading = false;
        if (err.status == 401) this.msg = "Please login again";
        else if (err.status == 403) this.msg = "Only a Loan Officer can see this page";
        else this.msg = "Could not load the dashboard";
        this.cd.detectChanges();
      }
    });
  }

  clear()
  {
    this.filter.reset({ from: '', to: '' });
    this.getDashboard();
  }

  // real funnel shape: each segment is a trapezoid, as wide at the bottom as the next stage
  buildFunnel(list: any[])
  {
    var max = list.length ? list[0].count : 0;
    var w = list.map(f => max > 0 ? Math.max((f.count / max) * 100, 14) : 14);

    this.funnel = list.map((f, i) => {
      var a = w[i];
      var b = i < list.length - 1 ? w[i + 1] : Math.max(a * 0.6, 8);
      var clip = `polygon(${50 - a / 2}% 0, ${50 + a / 2}% 0, ${50 + b / 2}% 100%, ${50 - b / 2}% 100%)`;
      return { stage: f.stage, count: f.count, clip: clip, color: this.funnelColors[i % this.funnelColors.length] };
    });
  }

  // portfolio donut: one coloured slice per product
  buildDonut(list: any[])
  {
    var start = 0;
    var parts: string[] = [];
    this.totalOutstanding = 0;
    list.forEach((p: any, i: number) => {
      var end = start + p.percent;
      parts.push(`${this.colors[i % this.colors.length]} ${start}% ${end}%`);
      start = end;
      this.totalOutstanding += p.outstanding;
    });
    this.portfolioDonut = parts.length ? `conic-gradient(${parts.join(',')})` : '#dee2e6';
  }

  // 12,50,00,000 -> "125.00 Cr"
  money(v: number)
  {
    if (v >= 10000000) return (v / 10000000).toFixed(2) + " Cr";
    if (v >= 100000) return (v / 100000).toFixed(2) + " L";
    return Math.round(v).toLocaleString('en-IN');
  }

  // collection bar height (percent, never more than 100)
  barHeight(p: number)
  {
    return Math.min(p, 100);
  }
}