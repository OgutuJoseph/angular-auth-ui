import { Component } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { NgToastService } from 'ng-angular-popup';
import ValidateForm from 'src/app/helpers/validateform';
import { AuthService } from 'src/app/services/auth.service';
import { UserStoreService } from 'src/app/services/user-store.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent {

  type: string = "password";
  isText: boolean = false;
  eyeIcon: string = "fa-eye-slash";
  loginForm!: FormGroup;

  constructor(
    private fb: FormBuilder, 
    private auth : AuthService, 
    private router : Router,
    private toast: NgToastService,
    private userStore: UserStoreService
  ) {  }

  ngOnInit(): void {
    this.loginForm = this.fb.group({
      username: ['', Validators.required],
      password: ['', Validators.required]
    })
  }

  hideShowPass() {
    this.isText = !this.isText;
    this.isText ? this.eyeIcon = "fa-eye" : this.eyeIcon = "fa-eye-slash";
    this.isText ? this.type = "text" : this.type = "password"
  }

  /** After Refactor */
  submitLogin() {
    if(this.loginForm.valid) {
      // Send object to database
      // console.log('values ', this.loginForm.value)
      this.auth.login(this.loginForm.value)
      .subscribe({
        next: (res) => {
          // alert(res.message);
          this.loginForm.reset();
          this.auth.storeToken(res.token);
          const tokenPayload = this.auth.decodedToken();
          this.userStore.setFullNameForStore(tokenPayload.unique_name);
          this.userStore.setRoleForStore(tokenPayload.role);
          this.toast.success({ detail: "Success", summary: res.message, duration: 5000 })
          this.router.navigate(['dashboard']);
        },
        error: (err) => {
          // alert(err?.error.message)
          this.toast.error({ detail: "Error", summary: "Invalid username or password", duration: 5000 })
        }
      })
    } else {
      // Throw error using toastr with the required fields
      // console.log('Form is not valid')
      ValidateForm.validateAllFormFields(this.loginForm);
      alert('Your form is invalid');
    }
  }
}
