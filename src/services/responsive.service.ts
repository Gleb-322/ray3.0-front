import { BreakpointObserver } from '@angular/cdk/layout';
import { computed, inject, Injectable } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';

@Injectable({
  providedIn: 'root',
})
export class ResponsiveService {
  private readonly small = '(max-width: 640px)';
  private readonly medium = '(min-width: 641px) and (max-width: 1309px)';
  private readonly large = '(min-width: 1310px)';

  breakPointObserver = inject(BreakpointObserver);
  screenWidth = toSignal(
    this.breakPointObserver.observe([this.large, this.medium, this.large])
  );

  smallWidth = computed(() => this.screenWidth()?.breakpoints[this.small]);
  mediumWidth = computed(() => this.screenWidth()?.breakpoints[this.medium]);
  largeWidth = computed(() => this.screenWidth()?.breakpoints[this.large]);
}
