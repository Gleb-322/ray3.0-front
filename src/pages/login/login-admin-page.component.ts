import { Component } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { AdminService } from '../../services/admin.service';

import { MyErrorStateMatcher } from '../../app/material.module';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'login-admin-page',
  templateUrl: './login-admin-page.component.html',
})
export class LoginPageComponent {
  hide = true;
  adminForm;
  errorMessage: string | null = null;
  errorMessageStatus = false;
  matcher = new MyErrorStateMatcher();

  constructor(
    private _adminService: AdminService,
    private router: Router,
    private _toastr: ToastrService
  ) {
    this.adminForm = new FormGroup({
      login: new FormControl('', Validators.required),
      password: new FormControl('', [Validators.required]),
    });
  }

  onFormSubmit() {
    const postObject = {
      login: this.adminForm.value?.login,
      password: this.adminForm.value?.password,
    };
    if (postObject) {
      this._adminService.postLoginAdmin(postObject).subscribe((result) => {
        if (result.errorCode === 0) {
          if (result.token) {
            sessionStorage.setItem('token', result.token);
            this.router.navigate(['/admin']);
          }
        }
        if (result.errorCode === 1) {
          this._toastr.error(
            `Что-то пошло не так, попробуйте снова.`,
            'Ошибка сервера',
            {
              disableTimeOut: true,
            }
          );
        }
        if (result.errorCode === 2) {
          this.errorMessage = result.errorMessage;
          this.errorMessageStatus = true;
        }
      });
    }
  }
}
