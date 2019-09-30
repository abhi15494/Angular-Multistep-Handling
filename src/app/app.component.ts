import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  forms: FormGroup;

  // Form Status Control variables -----------------------------------------------
  // formStatus:
  // 1: loading
  // 2: success
  // 3: error
  formStatus: number = 1;
  formstep: number = 1;
  statusMessage: string = "Please wait...";
  response: any = {};

  constructor(
    // Form builder instance form form definations
    private _fb: FormBuilder
  ) {
    // Form sturcture for form fields
    this.forms = this._fb.group({
      'form1': this._fb.group({
        'name': ['', Validators.required],
        'tel': [''],
      }),
      'form2': this._fb.group({
        'email': ['', Validators.compose([Validators.required, Validators.email])],
        'status': ['Success']
      })
    });
  }

  // Form submission method that include form data conversion according to API and 
  // call api as well as handle response of API
  onFormSubmit(formData) {
    this.formstep = 3;
    this.dummyApiHandler(formData).then(
      data => {
        this.formStatus = 2;
        this.statusMessage = data['message'];
        this.response = data;
      }
    ).catch(
      error => {
        this.formStatus = 3;
        this.statusMessage = error['message'];
        this.response = error;
      }
    )
  }

  // Reset the Entire form and put it in initial state.
  resetForm() {
    this.formstep = 1;
    this.formStatus = 1;
    this.statusMessage = "Please wait...";
    this.forms.reset()
  }

  // Method to change the current step of form
  stepChange(step) {
    step?this.formstep++:this.formstep--;
  }

  // Dummy Api method, when called then it's wait for 1.5 sec and return a promise
  dummyApiHandler(data): Promise<any> {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        if (data['form2']['status'] == "Success") {
          const response = {
            message: 'YO! Your form is submitted.',
            ...data
          };
          resolve(response);
        } else if (data['form2']['status'] == 'Error') {
          const response = {
            message: 'Well! Something went wrong',
            ...data
          };
          reject(response);
        } else {
          const response = {
            message: 'Well! Something went wrong',
            ...data
          };
          reject(response);
        }
      }, 1500);
    });
  }
}
