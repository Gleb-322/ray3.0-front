import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { PreviewPageComponent } from '../pages/preview/preview-page.component';
import { RegPageComponent } from '../pages/registration/reg-page.component';
import { NotFoundPageComponent } from '../pages/not-found-page/not-found-page.component';
import { LoginPageComponent } from '../pages/login/login-admin-page.component';
import { LayoutComponent } from './components/layout/layout.component';
import { AdminDashboardPageComponent } from '../pages/admin-dashboard/admin-dashboard-page.component';
import { AnalyticsPageComponent } from '../pages/analytics-page/analytics-page.component';
import { PatientsPageComponent } from '../pages/patients-page/patients-page.component';
import { authGuard } from '../services/auth.guard';
import { PolicyPageComponent } from '../pages/policy-page/policy-page.component';
import { CheckComponent } from './components/check/check.component';

const routes: Routes = [
  { path: 'login', component: LoginPageComponent },
  { path: 'policy', component: PolicyPageComponent },
  { path: '', redirectTo: 'preview', pathMatch: 'full' },
  { path: 'admin', redirectTo: 'admin/patients', pathMatch: 'full' },
  {
    path: '',
    component: LayoutComponent,
    children: [
      { path: 'preview', component: PreviewPageComponent },
      { path: 'registration', component: RegPageComponent },
      { path: 'check', component: CheckComponent },
    ],
  },
  {
    path: 'admin',
    component: AdminDashboardPageComponent,
    children: [
      {
        path: 'patients',
        component: PatientsPageComponent,
        canActivate: [authGuard],
      },
      {
        path: 'analytics',
        component: AnalyticsPageComponent,
        canActivate: [authGuard],
      },
    ],
  },
  { path: '**', component: NotFoundPageComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
