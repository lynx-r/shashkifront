/*
 * © Copyright
 *
 * signin-page.component.ts is part of shashkifront.nosync.
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

import { Component, OnInit } from '@angular/core';
import { select, Store } from '@ngrx/store';
import { Login } from '../../core/actions/user';
import { getLoginPageError, getLoginPagePending, RootState } from '../../core/reducers/reducer.reducer';
import { UserCredentials } from '../../domain/user-credentials';

@Component({
  selector: 'app-signin-page',
  template: `
      <div class="vertical-center">
          <app-signin
                  (submitted)="onSubmit($event)"
                  [pending]="pending$ | async"
                  [errorMessages]="errors$ | async">
          </app-signin>
      </div>
  `,
  styles: [`
      :host {
          flex: 1 1 auto;
          display: flex;
      }
  `
  ],
})
export class SigninPageComponent implements OnInit {
  pending$ = this.store.pipe(select(getLoginPagePending));
  errors$ = this.store.pipe(select(getLoginPageError));

  constructor(private store: Store<RootState>) {
  }

  ngOnInit() {
  }

  onSubmit($event: UserCredentials) {
    this.store.dispatch(new Login($event));
  }
}
