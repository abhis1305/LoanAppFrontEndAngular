import { ChangeDetectorRef, Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { SupportService } from '../../services/support-service';

// OFFICER page: all customers' tickets, view and reply
@Component({
  imports: [CommonModule,ReactiveFormsModule],
  selector: 'app-support-officer',
  styleUrl: './officer-support.scss',
  templateUrl: './officer-support.html',
})
export class SupportOfficer {
  constructor(private service:SupportService,private cd:ChangeDetectorRef)
  {
    this.getTickets();
  }

  reply=new FormGroup({
    officerResponse:new FormControl(''),
    status:new FormControl('Completed'),
  });

  alltickets:any;
  selected:any;
  showReply=false;      // View + Reply box open?
  statusFilter='';      // '', 'pending', 'progress', 'complet'
  listMsg='';
  msg='';

  // all tickets
  getTickets()
  {
    this.service.getAllTickets().subscribe({
      next:res=>{
        this.alltickets=res;
        this.listMsg='';
        this.cd.detectChanges();
      },
      error:err=>{
        console.log(err);
        if(err.status==401) this.listMsg='Please login again';
        else if(err.status==403) this.listMsg='Only a Loan Officer can see this page';
        else this.listMsg='Could not load tickets';
        this.cd.detectChanges();
      }
    });
  }

  // the rows shown in the table (after the status filter)
  shown()
  {
    var list=this.alltickets||[];
    if(!this.statusFilter)
    {
      return list;
    }
    return list.filter((t:any)=>(t.status||'').toLowerCase().includes(this.statusFilter));
  }

  // open one ticket with the reply form
  ViewTicket(t:any)
  {
    this.selected=t;
    this.msg='';
    this.reply.controls.officerResponse.setValue(t.officerResponse || '');
    this.reply.controls.status.setValue(t.status=='Pending' ? 'Completed' : t.status);
    this.showReply=true;
  }

  CloseReply()
  {
    this.showReply=false;
  }

  SaveResponse(data:any)
  {
    if(!data.officerResponse || !data.officerResponse.trim())
    {
      this.msg='Please write a response';
      return;
    }

    var body={
      officerResponse:data.officerResponse.trim(),
      status:data.status
    };

    this.service.RespondTicket(this.selected.ticketId,body).subscribe({
      next:res=>{
        alert(res.message);
        this.showReply=false;
        this.getTickets();
      },
      error:err=>{
        console.log(err);
        this.msg=err.status==403 ? 'Only a Loan Officer can reply' : 'Could not save the response';
        this.cd.detectChanges();
      }
    });
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