import { Component, computed } from '@angular/core';
import { AdminService } from '../../services/admin.service';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { ResponsiveService } from '../../services/responsive.service';

@Component({
  selector: 'app-admin-dashboard-page',
  templateUrl: './admin-dashboard-page.component.html',
})
export class AdminDashboardPageComponent {
  sideDrawlerOpen = true;
  constructor(
    private _adminService: AdminService,
    private router: Router,
    private _toastr: ToastrService,
    private _responsiveService: ResponsiveService
  ) {}

  // open/close angular material sidenav
  openCloseDrawer() {
    this.sideDrawlerOpen = !this.sideDrawlerOpen;
  }

  // adaptation angular material sidenav
  responsiveMatDrawer = computed(() => {
    if (this._responsiveService.largeWidth()) {
      this.sideDrawlerOpen = true;
      return 'side';
    } else {
      this.sideDrawlerOpen = false;
      return 'over';
    }
  });

  // logout admin dashboard
  logoutAdmin() {
    const token = sessionStorage.getItem('token');
    if (token != null) {
      this._adminService.logOutAdmin(token).subscribe((result) => {
        if (result.errorCode === 0) {
          sessionStorage.removeItem('token');
          this.router.navigate(['/login']);
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
