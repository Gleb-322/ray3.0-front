import { Component, OnInit } from '@angular/core';
import { AdminService } from '../../services/admin.service';

@Component({
  selector: 'app-analytics-page',
  templateUrl: './analytics-page.component.html',
})
export class AnalyticsPageComponent implements OnInit {
  constructor(public adminService: AdminService) {}
  ngOnInit(): void {}
}
