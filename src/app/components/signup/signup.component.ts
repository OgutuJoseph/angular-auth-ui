import { Component } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { NgToastService } from 'ng-angular-popup';
import ValidateForm from 'src/app/helpers/validateform';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.scss']
})
export class SignupComponent {

  type: string = "password";
  isText: boolean = false;
  eyeIcon: string = "fa-eye-slash";
  signUpForm!: FormGroup;

  constructor(
    private fb: FormBuilder, 
    private auth : AuthService, 
    private router : Router,
    private toast: NgToastService
  ) {  }

  ngOnInit(): void {
    this.signUpForm = this.fb.group({
      firstname: ['', Validators.required],
      lastname: ['', Validators.required],
      username: ['', Validators.required],
      email: ['', Validators.required],
      password: ['', Validators.required]
    })
  }

  hideShowPass() {
    this.isText = !this.isText;
    this.isText ? this.eyeIcon = "fa-eye" : this.eyeIcon = "fa-eye-slash";
    this.isText ? this.type = "text" : this.type = "password"
  }

  /** Before Refactor */
  // submitSignUp() {
  //   if(this.signUpForm.valid) {
  //     // Perform logic for signup
  //     console.log('values ', this.signUpForm.value)
  //   } else {
  //     // Perform logic for validation errors
  //     // console.log('Form is not valid')
  //     this.validateAllFormFields(this.signUpForm);
  //     alert('Your form is invalid');
  //   }
  // }

  // private validateAllFormFields(formGroup:FormGroup){
  //   Object.keys(formGroup.controls).forEach(field => {
  //     const control = formGroup.get(field);

  //     if (control instanceof FormControl) {
  //       control.markAsDirty({onlySelf:true});
  //     } else if (control instanceof FormGroup) {
  //       this.validateAllFormFields(control);
  //     }
  //   })
  // }

  /** After Refactor */
  submitSignUp() {
    if(this.signUpForm.valid) {
      // Perform logic for signup
      // console.log('values ', this.signUpForm.value)

      this.auth.signUp(this.signUpForm.value)
      .subscribe({
        next: (res => {
          // alert(res.message);
          this.toast.success({ detail: "Success", summary: res.message, duration: 5000 })
          this.signUpForm.reset();
          this.router.navigate(['login']);
        }),
        error: (err => {
          // alert(err?.error.message)
          this.toast.error({ detail: "Error", summary: err.error.message, duration: 5000 })

        })
      })
    } else {
      // Perform logic for validation errors
      // console.log('Form is not valid')
      ValidateForm.validateAllFormFields(this.signUpForm);
      alert('Your form is invalid');
    }
  }
}
