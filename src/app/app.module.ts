import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppRoutingModule } from './app-routing.module';
import { HttpClientModule } from '@angular/common/http';
import { provideToastr } from 'ngx-toastr';

import { MaterialModule } from './material.module';
import { provideMomentDateAdapter } from '@angular/material-moment-adapter';
import { NgxMaskDirective, NgxMaskPipe, provideNgxMask } from 'ngx-mask';

import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';

import { AppComponent } from './app.component';
import { DescriptionComponent } from './components/description/description.component';
import { LayoutComponent } from './components/layout/layout.component';
import { AddComponent } from './components/add/add.component';
import { EditComponent } from './components/edit/edit.component';
import { DialogComponent } from './components/dialog/dialog.component';
import { CheckComponent } from './components/check/check.component';

import { PreviewPageComponent } from '../pages/preview/preview-page.component';
import { RegPageComponent } from '../pages/registration/reg-page.component';
import { NotFoundPageComponent } from '../pages/not-found-page/not-found-page.component';
import { LoginPageComponent } from '../pages/login/login-admin-page.component';
import { AdminDashboardPageComponent } from '../pages/admin-dashboard/admin-dashboard-page.component';
import { AnalyticsPageComponent } from '../pages/analytics-page/analytics-page.component';
import { PatientsPageComponent } from '../pages/patients-page/patients-page.component';
import { PolicyPageComponent } from '../pages/policy-page/policy-page.component';

// import { WebSocketService } from '../services/web-socket.service';
import { SocketIoModule, SocketIoConfig } from 'ngx-socket-io';
const config: SocketIoConfig = {
  url: 'http://localhost:3000',
  options: {
    reconnection: true,
    reconnectionAttempts: 5,
    reconnectionDelay: 1000,
  },
};

@NgModule({
  declarations: [
    AppComponent,
    PreviewPageComponent,
    RegPageComponent,
    DescriptionComponent,
    NotFoundPageComponent,
    LoginPageComponent,
    LayoutComponent,
    AdminDashboardPageComponent,
    AnalyticsPageComponent,
    PatientsPageComponent,
    PolicyPageComponent,
    AddComponent,
    EditComponent,
    DialogComponent,
    CheckComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    MaterialModule,
    NgxMaskDirective,
    NgxMaskPipe,
    HttpClientModule,
    SocketIoModule.forRoot(config),
  ],
  providers: [
    provideAnimationsAsync(),
    provideNgxMask(),
    provideMomentDateAdapter(),
    provideToastr(),
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
