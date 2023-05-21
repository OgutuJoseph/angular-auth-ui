import { Injectable } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { NgToastService } from 'ng-angular-popup';

// export const authGuard: CanActivateFn = (route, state) => {
//   return true;
// };

@Injectable({
  providedIn: 'root'
})

export class AuthGuard {

  constructor(
    private auth : AuthService, 
    private router : Router,
    private toast : NgToastService
    ) { }

  canActivate(): boolean{
    if(this.auth.isLoggedIn()){
      return true;
    } else {
      this.toast.error({ detail: "Unauthorized", summary: "You are not logged in.", duration: 5000 })
      this.router.navigate(['login']);
      return false;
    }    
  }
}
