import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { NgToastService } from 'ng-angular-popup';
import { confirmPasswordValidator } from 'src/app/helpers/confirm-password.validator';
import ValidateForm from 'src/app/helpers/validateform';
import { ResetPassword } from 'src/app/models/reset-password.model';
import { ResetPasswordService } from 'src/app/services/reset-password.service';

@Component({
  selector: 'app-reset-password',
  templateUrl: './reset-password.component.html',
  styleUrls: ['./reset-password.component.scss']
})
export class ResetPasswordComponent {

  resetPasswordForm! : FormGroup;
  emailToReset! : string;
  emailToken!: string;
  resetPasswordObj = new ResetPassword;

  constructor(
    private fb: FormBuilder,
    private activatedRoute : ActivatedRoute,
    private resetService : ResetPasswordService,
    private toast : NgToastService,
    private router : Router
  ) { }

  ngOnInit(): void {
    this.resetPasswordForm = this.fb.group({
      password: [null, Validators.required],
      confirmPassword: [null, Validators.required]
    }, {
      validator : confirmPasswordValidator("password", "confirmPassword")
    });

    this.activatedRoute.queryParams.subscribe(val => {
      this.emailToReset = val['email'];
      let uriToken = val['code'];
      this.emailToken = uriToken.replace(/ /g,'+');

      console.log('email to reset: ', this.emailToReset);
      console.log('email token: ', this.emailToken);
    })
  }

  resetPassword() {
    if(this.resetPasswordForm.valid) {
      this.resetPasswordObj.email = this.emailToReset;
      this.resetPasswordObj.emailToken = this.emailToken;
      this.resetPasswordObj.newPassword = this.resetPasswordForm.value.password;
      this.resetPasswordObj.confirmPassword = this.resetPasswordForm.value.confirmPassword;

      this.resetService.resetPassword(this.resetPasswordObj)
      .subscribe({
        next: (res) => {
          this.toast.success({
            detail: 'Success',
            summary: res.message,
            duration: 5000
          })
          this.router.navigate(['/']);
        },
        error: (err) => {
          this.toast.error({
            detail: 'Error',
            summary: 'Something went wrong',
            duration: 5000
          })
        }
      })
    } else {
      ValidateForm.validateAllFormFields(this.resetPasswordForm);
    }
  }
}
