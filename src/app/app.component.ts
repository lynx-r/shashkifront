/*
 * © Copyright
 *
 * app.component.ts is part of shashkifront.nosync.
 *
 * shashkifront.nosync is free software: you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * shashkifront.nosync is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License
 * along with shashkifront.nosync.  If not, see <https://www.gnu.org/licenses/>.
 *
 */

import { DOCUMENT } from '@angular/common';
import { Component, Inject, OnDestroy, OnInit, Renderer2, } from '@angular/core';
import { select, Store } from '@ngrx/store';
import { untilComponentDestroyed } from '@w11k/ngx-componentdestroyed';
import { filter, tap } from 'rxjs/operators';
import { getUserState, RootState } from './core/reducers/reducer.reducer';
import { UpdateService } from './core/services/update.service';

@Component({
  selector: 'app-root',
  template: `
      <ngx-loading-bar></ngx-loading-bar>
      <app-layout-container>
          <router-outlet></router-outlet>
      </app-layout-container>
  `,
  styles: []
})
export class AppComponent implements OnInit, OnDestroy {

  constructor(
    private store: Store<RootState>,
    private renderer: Renderer2,
    private updateService: UpdateService,
    @Inject(DOCUMENT) private document: Document,
  ) {
  }

  ngOnInit() {
    this.updateService.pollUpdates();
    this.store
      .pipe(
        select(getUserState),
        filter(u => !!u),
        tap(u => {
          this.renderer.removeClass(this.document.body, 'default');
          this.renderer.removeClass(this.document.body, 'unicorn-dark-theme');
          const themeClass = u.theme ? u.theme : 'default';
          this.renderer.addClass(this.document.body, themeClass);
        }),
        untilComponentDestroyed(this)
      )
      .subscribe();
  }

  ngOnDestroy() {
  }

}
