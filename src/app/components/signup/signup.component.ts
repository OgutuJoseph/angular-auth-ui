import { Component } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import ValidateForm from 'src/app/helpers/validateform';

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

  constructor(private fb: FormBuilder) {  }

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
      console.log('values ', this.signUpForm.value)
    } else {
      // Perform logic for validation errors
      // console.log('Form is not valid')
      ValidateForm.validateAllFormFields(this.signUpForm);
      alert('Your form is invalid');
    }
  }
}
