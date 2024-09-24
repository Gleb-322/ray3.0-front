import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormControl, Validators, FormGroup } from '@angular/forms';

import { MatDialog, MatDialogRef } from '@angular/material/dialog';

import { MatDatepickerInputEvent } from '@angular/material/datepicker';

import { MyErrorStateMatcher } from '../../material.module';

import { Moment } from 'moment';

import {
  DateAdapter,
  MAT_DATE_FORMATS,
  MAT_DATE_LOCALE,
} from '@angular/material/core';

import * as _moment from 'moment';
// tslint:disable-next-line:no-duplicate-imports
import { default as _rollupMoment } from 'moment';
import 'moment/locale/ru';
import { PatientsService } from '../../../services/patients.service';
import { IPatients } from '../../../types/types';
import { MY_FORMATS } from '../../material.module';
import { DisabledDatesService } from '../../../services/disabled-dates.service';
import { ToastrService } from 'ngx-toastr';
import { DialogComponent } from '../dialog/dialog.component';
import { SocketService } from '../../../services/web-socket.service';

const moment = _rollupMoment || _moment;

const lang = moment.locale('ru');

@Component({
  selector: 'app-add',
  templateUrl: './add.component.html',
  providers: [
    { provide: MAT_DATE_LOCALE, useValue: lang },
    { provide: MAT_DATE_FORMATS, useValue: MY_FORMATS },
  ],
})
export class AddComponent implements OnInit, OnDestroy {
  addForm;
  disDate: string | null = null;
  cisDateFormat: string | undefined;
  timeStatus = false;
  arrTimes: string[] = [];
  arrayDisabledDates: string[] = [];
  minDate: Moment = moment(new Date());
  matcher = new MyErrorStateMatcher();
  constructor(
    private _dateAdapter: DateAdapter<Date>,
    private _patientsService: PatientsService,
    private _disabledDateService: DisabledDatesService,
    private _socketService: SocketService,
    private _dialogRef: MatDialogRef<AddComponent>,
    private _dialog: MatDialog,
    private _toastr: ToastrService
  ) {
    // bind context with date of datepicker
    this.sundayAndDisabledDatesFilter =
      this.sundayAndDisabledDatesFilter.bind(this);
    // create add form
    this.addForm = new FormGroup({
      name: new FormControl('', [
        Validators.required,
        Validators.pattern(/^[a-zA-Zа-яА-Я\s]*$/),
      ]),
      phone: new FormControl('', [
        Validators.required,
        Validators.minLength(16),
      ]),
      email: new FormControl(
        '',
        Validators.pattern(
          /^[a-z0-9][a-z0-9-_\.]+@([a-z]|[a-z0-9]?[a-z0-9-]+[a-z0-9])\.[a-z0-9]{2,10}(?:\.[a-z]{2,10})?$/
        )
      ),
      date: new FormControl<Moment>(moment(''), Validators.required),
      time: new FormControl('', Validators.required),
    });
  }
  ngOnInit() {
    // set calendar for CIS format
    this._dateAdapter.setLocale('ru-RU');
    // get disanled dates from api
    this.getDisabledDates();
    //connect socket
    if (!this._socketService.isConnected()) {
      this._socketService.connect();
    }
    //function with socket service for already created patient
    this.getCreatedPatient();
    //function with socket service for get already disabled date
    this.getDisableDateWhenCreatedPatient();
  }

  ngOnDestroy() {
    // destroy socket connection
    this._socketService.disconnect();
  }

  // get already created patient
  getCreatedPatient() {
    this._socketService.getDateCreatedPatient().subscribe((date) => {
      if (this.cisDateFormat && date) {
        if (this.disDate) {
          this.addForm.controls['date'].setValue(null);
          this.arrTimes = [];
          this.timeStatus = false;
        } else {
          this.getTimeByDate(date);
          this.addForm.controls['time'].setValue(null);
        }
        this.addForm.controls['phone'].setValue(null);
        this.cisDateFormat = '';
      }
    });
  }

  //get disabled date
  getDisableDateWhenCreatedPatient() {
    this._socketService
      .getDisableDateWhenCreatedPatient()
      .subscribe((disDate) => {
        if (disDate) {
          this.disDate = disDate;
          this.arrayDisabledDates.push(this.disDate);
        }
      });
  }

  // get disabled dates from api
  getDisabledDates() {
    this._disabledDateService.getDisabledDates().subscribe((result) => {
      if (result.errorCode === 0) {
        if (result.body && result.body.length > 0) {
          this.arrayDisabledDates = result.body.map((d) => d.disabledDate);
        } else {
          this.arrayDisabledDates = [];
        }
      }

      if (result.errorCode === 1) {
        this._toastr.error(
          `Не удалось получить массив заблокированных дат.`,
          'Ошибка сервера',
          {
            disableTimeOut: true,
          }
        );
      }
    });
  }

  // filter date by Sunday and disabled dates
  sundayAndDisabledDatesFilter(date: Moment | null) {
    const day = date?.isoWeekday();
    const input = moment(date).format('DD-MM-YYYY');
    return day !== 7 && !this.arrayDisabledDates.includes(input);
  }

  // get time array of selecked date
  getTimeByDate(date: string) {
    const bodyObject = {
      date,
    };
    this._patientsService.postTimeByDate(bodyObject).subscribe((result) => {
      if (result.errorCode === 0) {
        if (result.body.length > 0) {
          this.arrTimes = result.body;
          this.timeStatus = true;
        }
      } else {
        this._toastr.error(
          `Не удалось получить массив времени.`,
          'Ошибка сервера',
          {
            disableTimeOut: true,
          }
        );
      }
    });
  }

  // time field handler
  onChangeDate(event: MatDatepickerInputEvent<Moment>) {
    this.cisDateFormat = event.value?.format('DD-MM-YYYY');

    if (this.cisDateFormat) {
      this.getTimeByDate(this.cisDateFormat);
    }
  }

  // form submit handler
  onFormSubmit() {
    let dialogRef = this._dialog.open(DialogComponent, {
      data: {
        title: 'Добавление записи',
        body: 'Действительно хотите добавить новую запись?',
      },
    });

    dialogRef.afterClosed().subscribe((result: boolean) => {
      if (result) {
        if (this.addForm.valid) {
          const bodyObject: IPatients = {
            name: this.addForm.value?.name,
            phone: this.addForm.value?.phone,
            email: this.addForm.value?.email,
            date: this.addForm.value?.date?.format('DD-MM-YYYY'),
            time: this.addForm.value?.time,
          };
          if (bodyObject) {
            this._patientsService
              .postPatients(bodyObject)
              .subscribe((result) => {
                console.log(result);
                if (result.errorCode === 0) {
                  if (result.body) {
                    this._toastr.success(
                      `Запись успешно оформлена на ${result.body.date}, время: ${result.body.time}`,
                      '',
                      {
                        progressBar: true,
                      }
                    );
                    this._dialogRef.close(true);
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
                  this._dialogRef.close(true);
                }
                if (result.errorCode === 2) {
                  this._toastr.error(
                    `Не удалось отправить сообщение на указанную почту.`,
                    'Ошибка отправки почты',
                    {
                      disableTimeOut: true,
                    }
                  );
                  this._dialogRef.close(false);
                }

                if (result.errorCode === 3) {
                  if (result.body) {
                    this._toastr.error(
                      `Запись с датой ${result.body.date} и временем ${result.body.time} уже существует!`,
                      'Выберите другую дату!',
                      {
                        disableTimeOut: true,
                        closeButton: true,
                      }
                    );
                    this._dialogRef.close(false);
                  }
                }
              });
          }
        }
      } else {
        this._dialogRef.close();
      }
    });
  }

  // close dialog
  onCancel() {
    this._dialogRef.close();
  }
}
