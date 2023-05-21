import { Injectable } from '@angular/core';
import { HttpClient } from "@angular/common/http"
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private baseUrl:string = "https://localhost:7138/api/User/"
  constructor(
    private http : HttpClient,
    private router: Router
  ) { }

  signUp(userObj:any) {
    return this.http.post<any>(`${this.baseUrl}register`, userObj)
  }

  login(loginObj:any) {
    return this.http.post<any>(`${this.baseUrl}authenticate`, loginObj)
  }

  signOut(){
    localStorage.clear();
    this.router.navigate(['login']);
    /* Or if you only one to remove one item */
    // localStorage.removeItem('token');
  }

  storeToken(tokenValue: string) {
    localStorage.setItem('token', tokenValue)
  }

  getToken(){
    return localStorage.getItem('token');
  }

  isLoggedIn(): boolean {
    return !!localStorage.getItem('token')
  }
}
 