import { ChangeDetectorRef, Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { SupportService } from '../../services/support-service';

// CUSTOMER page: raise a query and see my own tickets
@Component({
  imports: [CommonModule,ReactiveFormsModule],
  selector: 'app-support',
  styleUrl: './support.scss',
  templateUrl: './support.html',
})
export class Support {
  customerId:any;

  constructor(private service:SupportService,private cd:ChangeDetectorRef)
  {
    this.customerId=this.service.getCustomerId();   // the customer who is logged in
    if(!this.customerId)
    {
      this.listMsg='Please login again';
      return;
    }
    this.getMyTickets();
    this.getLoan();
  }

  tickets=new FormGroup({
    loanaccountid:new FormControl(''),
    subject:new FormControl(''),
    description:new FormControl(''),
  });

  alltickets:any;     // my tickets
  myloan:any;         // my loan account
  selected:any;       // the ticket opened in the View box
  showAdd=false;      // Raise Query box open?
  showView=false;     // View box open?
  listMsg='';
  msg='';

  // only the logged-in customer's tickets
  getMyTickets()
  {
    this.service.getMyTickets(this.customerId).subscribe({
      next:res=>{
        this.alltickets=res;
        this.listMsg='';
        this.cd.detectChanges();
      },
      error:err=>{
        console.log(err);
        if(err.status==401) this.listMsg='Please login again';
        else if(err.status==403) this.listMsg='You are not allowed to see this page';
        else this.listMsg='Could not load tickets';
        this.cd.detectChanges();
      }
    });
  }

  // the customer's loan account for the form
  getLoan()
  {
    this.service.getActiveLoan(this.customerId).subscribe({
      next:res=>{
        this.myloan=res;
        this.tickets.controls.loanaccountid.setValue(res.loanAccountId);
        this.cd.detectChanges();
      },
      error:err=>{
        console.log(err);   // no active loan
      }
    });
  }

  OpenAdd()
  {
    this.msg='';
    this.showAdd=true;
  }

  CloseAdd()
  {
    this.showAdd=false;
  }

  SaveTicket(data:any)
  {
    if(!data.loanaccountid || !data.subject || !data.description)
    {
      this.msg='Please fill all the fields';
      return;
    }

    var body={
      customerId:this.customerId,
      loanAccountId:Number(data.loanaccountid),
      subject:data.subject,
      description:data.description
    };

    this.service.AddTicket(body).subscribe({
      next:res=>{
        alert(res.message);
        this.showAdd=false;
        this.tickets.controls.subject.setValue('');
        this.tickets.controls.description.setValue('');
        this.getMyTickets();
      },
      error:err=>{
        console.log(err);
        this.msg='Could not raise the ticket';
        this.cd.detectChanges();
      }
    });
  }

  ViewTicket(t:any)
  {
    this.selected=t;
    this.showView=true;
  }

  CloseView()
  {
    this.showView=false;
  }

  countOf(word:string)
  {
    return (this.alltickets||[]).filter((t:any)=>(t.status||'').toLowerCase().includes(word)).length;
  }

  badge(status:string)
  {
    var s=(status||'').toLowerCase();
    if(s.includes('complet')) return 'bg-success';
    if(s.includes('progress')) return 'bg-info';
    return 'bg-warning text-dark';
  }
}