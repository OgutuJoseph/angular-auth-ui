import { Component } from '@angular/core';
import { NgToastService } from 'ng-angular-popup';
import { ApiService } from 'src/app/services/api.service';
import { AuthService } from 'src/app/services/auth.service';
import { UserStoreService } from 'src/app/services/user-store.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent {

  public users : any = [];

  public fullName : string = "";
  public userRole! : string;

  constructor(
    private api : ApiService,
    private auth : AuthService,
    private toast : NgToastService,
    private userStore : UserStoreService
  ) {}

  ngOnInit() {
    this.api.getUsers()
    .subscribe(res => {
      this.users = res;
    })

    this.userStore.getFullNameFromStore()
    .subscribe(val=>{
      const fullNameFromToken = this.auth.getFullNameFromToken();
      this.fullName = val || fullNameFromToken;
      // this.fullName = fullNameFromToken;
    })

    this.userStore.getRoleFromStore()
    .subscribe(val=>{
      const roleFromToken = this.auth.getRoleFromToken();
      this.userRole = val || roleFromToken;
    })
  }

  logout() {
    this.auth.signOut();
    this.toast.warning({detail: 'User Signed Out', summary: 'Logged out successfully.'});
  }
}
