export interface IDate {
  date: string;
}

export interface IRangeDate {
  disabledDate: string;
  full?: boolean;
}
export interface IPatients {
  name: string | null | undefined;
  phone: string | null | undefined;
  email?: string | null | undefined;
  date: string | undefined;
  time: string | null | undefined;
  _id?: string;
  previousDate?: string;
  previousTime?: string;
  previousEmail?: string;
}
export interface IAdmin {
  login: string | null | undefined;
  password: string | null | undefined;
}

export interface IDialogData {
  title: string;
  body: string;
}

export interface IPhone {
  phone: string | null | undefined;
}
