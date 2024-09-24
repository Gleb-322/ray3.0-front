import { Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { IDialogData } from '../../../types/types';

@Component({
  selector: 'dialog-component',
  templateUrl: './dialog.component.html',
})
export class DialogComponent {
  constructor(
    public _dialogRef: MatDialogRef<DialogComponent>,
    @Inject(MAT_DIALOG_DATA) public dialogData: IDialogData
  ) {}
}
