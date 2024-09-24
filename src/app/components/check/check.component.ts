import { Component } from '@angular/core';
import { FormControl, Validators, FormGroup } from '@angular/forms';
import { MyErrorStateMatcher } from '../../material.module';
import { PatientsService } from '../../../services/patients.service';
import { IPatients, IPhone } from '../../../types/types';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-check',
  templateUrl: './check.component.html',
})
export class CheckComponent {
  checkForm;
  showContent = false;
  patient: IPatients | undefined;
  patientExist: boolean | undefined;
  isAdminPhone: boolean | undefined;
  phoneNumber: string | null | undefined;
  matcher = new MyErrorStateMatcher();
  constructor(
    private _patientsService: PatientsService,
    private _toastr: ToastrService
  ) {
    // create check form
    this.checkForm = new FormGroup({
      phone: new FormControl('', [
        Validators.required,
        Validators.minLength(16),
      ]),
    });
  }

  // form submit handler
  onFormSubmit() {
    if (this.checkForm.valid) {
      const bodyObject: IPhone = {
        phone: this.checkForm.value?.phone,
      };
      this.phoneNumber = bodyObject.phone;

      if (bodyObject) {
        this._patientsService
          .postCheckPatient(bodyObject)
          .subscribe((result) => {
            if (result.errorCode === 0) {
              if (result.adminPhone) {
                this.patientExist = false;
                this.showContent = true;
                this.isAdminPhone = true;
              } else {
                if (result.body) {
                  this.patient = result.body;
                  this.patientExist = true;
                  this.showContent = true;
                  this.isAdminPhone = false;
                } else {
                  this.patientExist = false;
                  this.showContent = true;
                  this.isAdminPhone = false;
                }
              }
            } else {
              this._toastr.error(`Что-то пошло не так.`, 'Ошибка сервера', {
                disableTimeOut: true,
              });
            }
          });
      }
    }
  }
}
