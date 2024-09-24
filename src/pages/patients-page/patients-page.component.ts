import { Component, OnInit, ViewChild, AfterViewInit } from '@angular/core';
import { AdminService } from '../../services/admin.service';
import { IPatients, IRangeDate } from '../../types/types';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { MatDialog } from '@angular/material/dialog';
import { AddComponent } from '../../app/components/add/add.component';
import { EditComponent } from '../../app/components/edit/edit.component';
import { DisabledDatesService } from '../../services/disabled-dates.service';
import { Moment } from 'moment';
import { ToastrService } from 'ngx-toastr';

import {
  DateAdapter,
  MAT_DATE_FORMATS,
  MAT_DATE_LOCALE,
} from '@angular/material/core';

import * as _moment from 'moment';
// tslint:disable-next-line:no-duplicate-imports
import { default as _rollupMoment } from 'moment';
import 'moment/locale/ru';
import { MY_FORMATS } from '../../app/material.module';
import {
  MatDateRangePicker,
  MatDatepickerInputEvent,
} from '@angular/material/datepicker';
import { DialogComponent } from '../../app/components/dialog/dialog.component';
import { MatButtonToggleChange } from '@angular/material/button-toggle';
import { MatSelectChange } from '@angular/material/select';

const moment = _rollupMoment || _moment;

const lang = moment.locale('ru');

@Component({
  selector: 'app-patients-page',
  templateUrl: './patients-page.component.html',
  providers: [
    { provide: MAT_DATE_LOCALE, useValue: lang },
    { provide: MAT_DATE_FORMATS, useValue: MY_FORMATS },
  ],
})
export class PatientsPageComponent implements AfterViewInit, OnInit {
  panelOpenState = false;
  arrayDisabledDates: string[] = [];
  arrayUndisabledDates: string[] = [];
  patients: IPatients[] = [];
  patientsLength: number | null = 0;
  minDate: Moment = moment(new Date());
  inputValue = '';
  limit: number = 10;
  page: number = 0;
  start: Moment | undefined;
  end: Moment | undefined;
  arrayOfObjectRangeDates: IRangeDate[] = [];
  unlockButtonStatus = false;
  postStatus = false;
  selectedValue!: string;

  timeArr = [
    '09-00',
    '09-30',
    '10-00',
    '10-30',
    '11-00',
    '11-30',
    '12-00',
    '12-30',
    '13-00',
    '13-30',
    '14-00',
    '14-30',
    '15-00',
    '15-30',
    '16-00',
    '16-30',
  ];

  displayedColumns: string[] = [
    'created',
    'name',
    'phone',
    'email',
    'date',
    'time',
    'action',
  ];

  @ViewChild(MatPaginator)
  paginator!: MatPaginator;

  @ViewChild('dateRangePicker', { static: false }) dateRangePicker: any;

  constructor(
    private _adminService: AdminService,
    private _disabledDateService: DisabledDatesService,
    private _dialog: MatDialog,
    private _dateAdapter: DateAdapter<Date>,
    private _toastr: ToastrService
  ) {
    this.sundayAndDisabledDatesFilter =
      this.sundayAndDisabledDatesFilter.bind(this);

    this.sundayAndDisabledUndisabledDatesFilter =
      this.sundayAndDisabledUndisabledDatesFilter.bind(this);
  }
  ngOnInit(): void {
    this._dateAdapter.setLocale('ru-RU');
    this.getDisabledDates();
    this.getPatientsList(this.page, this.limit, this.inputValue);
  }
  ngAfterViewInit(): void {
    this.page = this.paginator.pageIndex;
    this.limit = this.paginator.pageSize;
    this.paginator._intl.itemsPerPageLabel = 'пациентов на странице:';
    this.paginator._intl.getRangeLabel = (
      page: number,
      pageSize: number,
      length: number
    ) => {
      const start = page * pageSize + 1;
      const end = (page + 1) * pageSize;
      if (end > length) {
        return `${start}-${length} из ${length}`;
      }
      return `${start}-${end} из ${length}`;
    };
  }

  // get list of all patients
  getPatientsList(page: number, limit: number, keyword: string = '') {
    this._adminService
      .getAllPatients(page + 1, limit, keyword)
      .subscribe((result) => {
        if (result.errorCode === 0) {
          if (result.body) {
            this.patients = result.body;
            this.patientsLength = result.count;
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
      });
  }

  // get disabled dates from api
  getDisabledDates() {
    this._disabledDateService.getDisabledDates().subscribe((result) => {
      if (result.errorCode === 0) {
        if (result.body && result.body.length > 0) {
          this.arrayDisabledDates = result.body.map((d) => d.disabledDate);
          this.arrayUndisabledDates = result.body
            .filter((d) => d.full !== true)
            .map((d) => d.disabledDate);
        } else {
          this.arrayDisabledDates = [];
          this.arrayUndisabledDates = [];
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

  //create new patient
  openAddForm() {
    let dialogRef = this._dialog.open(AddComponent);
    dialogRef.afterClosed().subscribe((close: boolean) => {
      if (close) {
        this.getDisabledDates();
        this.getPatientsList(this.page, this.limit, this.inputValue);
      }
    });
  }

  //update selected patient
  openEditForm(data: IPatients) {
    let dialogRef = this._dialog.open(EditComponent, {
      data,
    });
    dialogRef.afterClosed().subscribe((close) => {
      if (close) {
        this.getDisabledDates();
        this.getPatientsList(this.page, this.limit, this.inputValue);
      }
    });
  }

  //delete selected patient
  deletePatient(_id: string) {
    let dialogRef = this._dialog.open(DialogComponent, {
      data: {
        title: 'Удаление записи',
        body: 'Действительно хотите удалить выбранную запись?',
      },
    });
    dialogRef.afterClosed().subscribe((close: boolean) => {
      if (close) {
        this._adminService.deletePatient(_id).subscribe((result) => {
          if (result.errorCode === 0) {
            if (result.body) {
              this.getDisabledDates();
              this.getPatientsList(this.page, this.limit, this.inputValue);
              this._toastr.success(
                `Вы успешно удалили запись на ${result.body.date}, время: ${result.body.time}`,
                '',
                {
                  progressBar: true,
                }
              );
            }
          }

          if (result.errorCode === 2) {
            this._toastr.error(`Не удалось найти пациента!`, 'Ошибка сервера', {
              disableTimeOut: true,
            });
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
        });
      }
    });
  }

  // get current page in paginator
  handlePageEvent(e: PageEvent) {
    this.page = e.pageIndex;
    this.getPatientsList(this.page, this.limit, this.inputValue);
  }

  // input filter
  onChangeFilter(e: Event) {
    const input = e.target as HTMLInputElement;
    this.inputValue = input.value;
    this.getPatientsList(this.page, this.limit, this.inputValue);
  }

  // select filter
  onChangeSelect(value: string) {
    this.inputValue = value;
    this.getPatientsList(this.page, this.limit, this.inputValue);
  }
  // date filter
  onChangeDate(event: MatDatepickerInputEvent<Moment>) {
    const cisDateFormat = event.value?.format('DD-MM-YYYY');
    if (cisDateFormat) {
      this.inputValue = cisDateFormat;
      this.getPatientsList(this.page, this.limit, this.inputValue);
    } else {
      this.inputValue = '';
      this.getPatientsList(this.page, this.limit, this.inputValue);
    }
  }

  // filter date by Sunday and disabled dates
  sundayAndDisabledDatesFilter(date: Moment | null) {
    const day = date?.isoWeekday();
    const input = moment(date).format('DD-MM-YYYY');
    return day !== 7 && !this.arrayDisabledDates.includes(input);
  }

  // filter range date picker by Sunday and disabled/undisabled dates
  sundayAndDisabledUndisabledDatesFilter(date: Moment | null) {
    const day = date?.isoWeekday();
    const input = moment(date).format('DD-MM-YYYY');
    if (this.unlockButtonStatus) {
      return day !== 7 && this.arrayUndisabledDates.includes(input);
    }

    return day !== 7 && !this.arrayDisabledDates.includes(input);
  }

  // change start date
  startCahnge(event: MatDatepickerInputEvent<Moment | undefined>) {
    this.start = moment(event.value, 'DD-MM-YYYY');
  }

  // change end date
  endCahnge(event: MatDatepickerInputEvent<Moment | undefined>) {
    this.end = moment(event.value, 'DD-MM-YYYY');
    this.dateRangeChange();
  }

  // change range disabled dates
  dateRangeChange() {
    if (this.start && this.end) {
      let currentDate = this.start.clone();
      while (currentDate <= this.end) {
        this.arrayOfObjectRangeDates.push({
          disabledDate: currentDate.format('DD-MM-YYYY'),
        });
        currentDate = currentDate.clone().add(1, 'days');
      }
    }

    if (
      this.arrayOfObjectRangeDates &&
      this.arrayOfObjectRangeDates.length > 0
    ) {
      let dialogRef = this._dialog.open(DialogComponent, {
        data: {
          title: this.unlockButtonStatus
            ? 'Разблокировка дат'
            : 'Блокировка дат',
          body: this.unlockButtonStatus
            ? 'Разблокировать выбранные(ую) даты(у)?'
            : 'Заблокировать выбранные(ую) даты(у)?',
        },
      });
      dialogRef.afterClosed().subscribe((result: boolean) => {
        if (result) {
          this.postStatus = true;
          this.dateRangeSubmit();
        } else {
          this.start = undefined;
          this.end = undefined;
          this.arrayOfObjectRangeDates = [];
        }
      });
    } else {
      this.postStatus = false;
    }
  }

  // post range disabled dates
  dateRangeSubmit() {
    if (this.postStatus) {
      if (this.unlockButtonStatus) {
        this._disabledDateService
          .postUnlockDisabledDates(this.arrayOfObjectRangeDates)
          .subscribe((result) => {
            if (result.errorCode === 0) {
              if (result.body) {
                this.start = undefined;
                this.end = undefined;
                this.arrayOfObjectRangeDates = [];
                this.getDisabledDates();
                this.unlockButtonStatus = false;
                this.postStatus = false;
                this._toastr.success(
                  `Дата(ы) успешно разблокировалась(ись)!`,
                  '',
                  {
                    progressBar: true,
                  }
                );
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
          });
      } else {
        this._disabledDateService
          .postDisabledDates(this.arrayOfObjectRangeDates)
          .subscribe((result) => {
            if (result.errorCode === 0) {
              if (result.body) {
                this.start = undefined;
                this.end = undefined;
                this.arrayOfObjectRangeDates = [];
                this.getDisabledDates();
                this.postStatus = false;
                this._toastr.success(
                  `Дата(ы) успешно заблокировалась(ись)!`,
                  '',
                  {
                    progressBar: true,
                  }
                );
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
          });
      }
    }
  }

  // open range picker and unlock disabled dates or lock undisabled dates and clean inputs
  openDatePicker(picker: MatDateRangePicker<Moment>) {
    this.start = undefined;
    this.end = undefined;
    this.arrayOfObjectRangeDates = [];
    this.unlockButtonStatus = !this.unlockButtonStatus;
    picker.open();
  }
}
