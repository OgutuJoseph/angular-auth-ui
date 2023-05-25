import { Component } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { NgToastService } from 'ng-angular-popup';
import ValidateForm from 'src/app/helpers/validateform';
import { AuthService } from 'src/app/services/auth.service';
import { ResetPasswordService } from 'src/app/services/reset-password.service';
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
  
  public resetPasswordEmail!: string;
  public isValidEmail!: boolean;

  constructor(
    private fb: FormBuilder, 
    private auth : AuthService, 
    private router : Router,
    private toast: NgToastService,
    private userStore: UserStoreService,
    private resetService: ResetPasswordService
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

          /** before introduction of access / refresh token */
          // this.auth.storeToken(res.token);

          /** after introduction of access / refresh token */
          this.auth.storeToken(res.accessToken);
          this.auth.storeRefreshToken(res.refreshToken);

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

  checkValidEmail(event: string) {
    const value = event;
    const pattern = /^[\w-\.]+@([\w-]+\.)+[\w-]{2,3}$/;  // abc@mail.co / abc@mail.com / abc.1@mail.co / abc.1@mail.com
    this.isValidEmail = pattern.test(value);
    return this.isValidEmail;
  }

  confirmPasswordReset() {
    if(this.checkValidEmail(this.resetPasswordEmail)){
      console.log('email here: ', this.resetPasswordEmail);

      // // to reset input field to blank
      // this.resetPasswordEmail = "";

      // // to auto close modal by simulating close button click
      // const buttonRef = document.getElementById("closeBtn");
      // buttonRef?.click();

      /** API Call */
      this.resetService.sendResetPasswordLink(this.resetPasswordEmail)
      .subscribe({
        next: (res) => {
          // toast notification
          this.toast.success({
            detail: "Success",
            summary: "Password reset request submitted",
            duration: 5000
          })

          // to reset input field to blank
          this.resetPasswordEmail = "";

          // to auto close modal by simulating close button click
          const buttonRef = document.getElementById("closeBtn");
          buttonRef?.click();
        },
        error: (err) => {
          this.toast.error({
            detail: "Error",
            summary: "Something went wrong. Make sure the email provided has been registered.",
            duration: 15000
          })
        }
      })
    }
  }
}
