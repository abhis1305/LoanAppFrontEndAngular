import { ChangeDetectorRef, Component } from '@angular/core';
import { NgTemplateOutlet } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ReportService } from '../../services/report-service';

// OFFICER reports page (role: Loan Officer) - every LOS and LMS report on one page
@Component({
  imports: [FormsModule, NgTemplateOutlet],
  selector: 'app-reports',
  styleUrl: './reports.scss',
  templateUrl: './reports.html',
})
export class Reports {

  todayText = new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' });

  private defs: any[] = [
    // ---------------- LOS ----------------
    { key: 'cibilRange', group: 'LOS', title: 'CIBIL Score Range Report', dates: true,
      cols: [
        { label: 'CIBIL Score Range', field: 'range', type: 'text' },
        { label: 'Applicants', field: 'applicants', type: 'num' },
        { label: 'Approved', field: 'approved', type: 'num' },
        { label: 'Approval %', field: 'approvalPercent', type: 'pct' },
      ],
      totals: ['applicants', 'approved'] },

    { key: 'scoreCardWise', group: 'LOS', title: 'Score Card Wise Report', dates: true,
      cols: [
        { label: 'Score Card', field: 'status', type: 'text' },
        { label: 'Decision', field: 'decision', type: 'text' },
        { label: 'Applicants', field: 'applicants', type: 'num' },
        { label: 'Approved', field: 'approved', type: 'num' },
        { label: 'Rejected', field: 'rejected', type: 'num' },
        { label: 'Pending', field: 'pending', type: 'num' },
      ],
      totals: ['applicants', 'approved', 'rejected', 'pending'] },

    { key: 'productWise', group: 'LOS', title: 'Product Wise Report', dates: true,
      cols: [
        { label: 'Product', field: 'product', type: 'text' },
        { label: 'Total Apps', field: 'totalApps', type: 'num' },
        { label: 'Approved', field: 'approved', type: 'num' },
        { label: 'Disbursed', field: 'disbursed', type: 'num' },
        { label: 'Disbursement %', field: 'disbursementPercent', type: 'pct' },
      ],
      totals: ['totalApps', 'approved', 'disbursed'] },

    { key: 'tat', group: 'LOS', title: 'Turn Around Time (TAT) Report', dates: true,
      cols: [
        { label: 'Stage', field: 'stage', type: 'text' },
        { label: 'Applications', field: 'count', type: 'num' },
        { label: 'Avg TAT (Days)', field: 'avgDays', type: 'dec' },
        { label: 'Min (Days)', field: 'minDays', type: 'dec' },
        { label: 'Max (Days)', field: 'maxDays', type: 'dec' },
      ],
      totals: [] },

    // ---------------- LMS ----------------
    { key: 'portfolio', group: 'LMS', title: 'Loan Portfolio Report', dates: false,
      cols: [
        { label: 'Product', field: 'product', type: 'text' },
        { label: 'Active Loans', field: 'activeLoans', type: 'num' },
        { label: 'Outstanding (₹)', field: 'outstanding', type: 'money' },
        { label: '%', field: 'percent', type: 'pct' },
      ],
      totals: ['activeLoans', 'outstanding'] },

    { key: 'emiCollection', group: 'LMS', title: 'EMI Collection Report', dates: true,
      cols: [
        { label: 'Particulars', field: 'particular', type: 'text' },
        { label: 'Count', field: 'count', type: 'num' },
        { label: 'Amount (₹)', field: 'amount', type: 'money' },
        { label: '%', field: 'percent', type: 'pct' },
      ],
      totals: [] },

    { key: 'overdue', group: 'LMS', title: 'Overdue Report', dates: false,
      cols: [
        { label: 'Days Overdue', field: 'bucket', type: 'text' },
        { label: 'Accounts', field: 'accounts', type: 'num' },
        { label: 'Overdue Amount (₹)', field: 'amount', type: 'money' },
        { label: '%', field: 'percent', type: 'pct' },
      ],
      totals: ['accounts', 'amount'] },

    { key: 'disbursement', group: 'LMS', title: 'Disbursement Report', dates: true,
      cols: [
        { label: 'Month', field: 'month', type: 'text' },
        { label: 'Loans Disbursed', field: 'loans', type: 'num' },
        { label: 'Disbursement Amount (₹)', field: 'amount', type: 'money' },
      ],
      totals: ['loans', 'amount'] },

    { key: 'prepayment', group: 'LMS', title: 'Prepayment Report', dates: true,
      cols: [
        { label: 'Type', field: 'type', type: 'text' },
        { label: 'Accounts', field: 'accounts', type: 'num' },
        { label: 'Prepayment Amount (₹)', field: 'amount', type: 'money' },
      ],
      totals: ['accounts', 'amount'] },
  ];

  // every report carries its own dates, rows and status
  reports: any[] = this.defs.map(d => ({ ...d, from: '', to: '', rows: [], loading: false, msg: '' }));
  los: any[] = this.reports.filter(r => r.group == 'LOS');
  lms: any[] = this.reports.filter(r => r.group == 'LMS');

  constructor(private service: ReportService, private cd: ChangeDetectorRef)
  {
    this.reports.forEach(r => this.search(r));     // load all reports when the page opens
  }

  // call the API of one report
  search(r: any)
  {
    var f: string = r.from || "";
    var t: string = r.to || "";
    var req: any;

    if (r.key == 'cibilRange') req = this.service.getCibilRange(f, t);
    else if (r.key == 'scoreCardWise') req = this.service.getScoreCardWise(f, t);
    else if (r.key == 'productWise') req = this.service.getProductWise(f, t);
    else if (r.key == 'tat') req = this.service.getTat(f, t);
    else if (r.key == 'portfolio') req = this.service.getPortfolio();
    else if (r.key == 'emiCollection') req = this.service.getEmiCollection(f, t);
    else if (r.key == 'overdue') req = this.service.getOverdue();
    else if (r.key == 'disbursement') req = this.service.getDisbursement(f, t);
    else if (r.key == 'prepayment') req = this.service.getPrepayment(f, t);

    r.loading = true;
    r.msg = "";

    req.subscribe({
      next: (res: any) => {
        // EMI collection comes as one object, the others as a list
        r.rows = Array.isArray(res) ? res : this.emiRows(res);
        r.loading = false;
        this.cd.detectChanges();
      },
      error: (err: any) => {
        console.log(err);
        r.rows = [];
        r.loading = false;
        if (err.status == 401) r.msg = "Please login again";
        else if (err.status == 403) r.msg = "Only a Loan Officer can see the reports";
        else r.msg = "Could not load the report (status " + err.status + ")";
        this.cd.detectChanges();
      }
    });
  }

  // EMI Billed / Collected / Pending rows
  emiRows(x: any)
  {
    var pending = Math.round((100 - x.efficiencyPercent) * 100) / 100;
    return [
      { particular: 'EMI Billed', count: x.billedCount, amount: x.billedAmount, percent: 100 },
      { particular: 'EMI Collected', count: x.collectedCount, amount: x.collectedAmount, percent: x.efficiencyPercent },
      { particular: 'EMI Pending', count: x.pendingCount, amount: x.pendingAmount, percent: x.billedCount > 0 ? pending : 0 },
    ];
  }

  // total of one column
  sum(r: any, field: string)
  {
    return r.rows.reduce((s: number, x: any) => s + (Number(x[field]) || 0), 0);
  }

  // show a value the Indian way (12,50,000) by column type
  show(v: any, type: string)
  {
    if (v === null || v === undefined || v === '') return '';
    var n = Number(v);
    if (type == 'text' || isNaN(n)) return v;
    if (type == 'money') return '₹ ' + n.toLocaleString('en-IN', { minimumFractionDigits: 0, maximumFractionDigits: 2 });
    if (type == 'pct') return n + '%';
    if (type == 'dec') return n.toLocaleString('en-IN', { maximumFractionDigits: 1 });
    return n.toLocaleString('en-IN');
  }

  // download one report as a CSV file (opens in Excel)
  Export(r: any)
  {
    if (r.rows.length == 0)
    {
      alert("No data to export");
      return;
    }

    var lines: string[] = [];
    lines.push(r.cols.map((c: any) => `"${c.label}"`).join(','));
    r.rows.forEach((row: any) => {
      lines.push(r.cols.map((c: any) => `"${String(row[c.field] ?? '').replace(/"/g, '""')}"`).join(','));
    });

    var blob = new Blob([lines.join('\n')], { type: 'text/csv' });
    var a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = r.title + '.csv';
    a.click();
    URL.revokeObjectURL(a.href);
  }
}