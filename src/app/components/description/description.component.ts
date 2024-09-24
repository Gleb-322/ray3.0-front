import { Component } from '@angular/core';
import { MatIconRegistry } from '@angular/material/icon';
import { DomSanitizer } from '@angular/platform-browser';

@Component({
  selector: 'preview-description',
  templateUrl: './description.component.html',
})
export class DescriptionComponent {
  buttonAppointment = 'записаться на прием';
  buttonCheck = 'проверить свою запись';
  constructor(
    private matIconRegistry: MatIconRegistry,
    private domSanitizer: DomSanitizer
  ) {
    this.matIconRegistry.addSvgIcon(
      'viber',
      this.domSanitizer.bypassSecurityTrustResourceUrl(
        '../../../assets/icons/viber.svg'
      )
    );
    this.matIconRegistry.addSvgIcon(
      'whatsapp',
      this.domSanitizer.bypassSecurityTrustResourceUrl(
        '../../../assets/icons/whatsapp.svg'
      )
    );
  }
}
