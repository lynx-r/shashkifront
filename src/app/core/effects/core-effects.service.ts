/*
 * © Copyright
 *
 * core-effects.service.ts is part of shashkifront.nosync.
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

import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Actions, Effect, ofType } from '@ngrx/effects';
import { BlockUI, NgBlockUI } from 'ng-block-ui';
import { of } from 'rxjs';
import { catchError, map, mergeMap, switchMap, tap } from 'rxjs/operators';
import { Failure } from '../../core/actions/general';
import { AppConstants } from '../../core/config/app-constants';
import { AuthService } from '../../core/services/auth.service';
import { Login, LoginSuccess, LogoutSuccess, Register, RegisterSuccess, SaveUser, UpdateUser, UserActionTypes } from '../actions/user';

@Injectable()
export class CoreEffects {
  @BlockUI() blockUI: NgBlockUI;

  @Effect()
  register$ = this.actions$
    .pipe(
      ofType(UserActionTypes.REGISTER),
      tap(() => this.blockUI.start(AppConstants.PAGE_LOADING_MESSAGE)),
      map((action: Register) => action.payload),
      switchMap((credentials) =>
        this.authService.register(credentials)
          .pipe(
            mergeMap((user) => [
              new RegisterSuccess(user),
              new LoginSuccess(user),
            ]),
            tap(() =>
              this.router.navigate([AppConstants.AFTER_LOGIN_REDIRECT])
                .then(() => this.blockUI.stop())
            ),
            catchError(() => {
              this.blockUI.stop();
              return of(new Failure(['E-mail занят']));
            })
          )
      )
    );

  @Effect()
  tryLogin$ = this.actions$
    .pipe(
      ofType(UserActionTypes.TRY_LOGIN),
      tap(() => this.blockUI.start(AppConstants.PAGE_LOADING_MESSAGE)),
      map((action: Login) => action.payload),
      switchMap(() =>
        this.authService.tryLogin()
          .pipe(
            map((user) => new LoginSuccess(user)),
            tap(() => this.blockUI.stop()),
            catchError((error) => {
              this.blockUI.stop();
              return of(error);
            })
          )
      ),
    );

  @Effect()
  login$ = this.actions$
    .pipe(
      ofType(UserActionTypes.LOGIN),
      tap(() => this.blockUI.start(AppConstants.PAGE_LOADING_MESSAGE)),
      map((action: Login) => action.payload),
      switchMap((credentials) =>
        this.authService.login(credentials)
          .pipe(
            map((user) => new LoginSuccess(user)),
            tap(() =>
              this.router.navigate([AppConstants.AFTER_LOGIN_REDIRECT])
                .then(() => this.blockUI.stop())
            ),
            catchError((error) => {
              this.blockUI.stop();
              return of(error);
            })
          )
      ),
    );

  @Effect()
  logout$ = this.actions$
    .pipe(
      ofType(UserActionTypes.LOGOUT),
      tap(() => this.blockUI.start(AppConstants.PAGE_LOADING_MESSAGE)),
      switchMap(() =>
        this.authService.logout()
          .pipe(
            map(() => new LogoutSuccess()),
            tap(() =>
              this.router.navigate([AppConstants.AFTER_LOGOUT_REDIRECT])
                .then(() => this.blockUI.stop())
            ),
            catchError((error) => {
              this.blockUI.stop();
              return of(error);
            })
          )
      ),
      catchError(err => {
        return of(err);
      })
    );

  @Effect()
  save$ = this.actions$
    .pipe(
      ofType(UserActionTypes.SAVE),
      tap(() => this.blockUI.start(AppConstants.PAGE_LOADING_MESSAGE)),
      map((action: SaveUser) => action.payload),
      switchMap((user) =>
        this.authService.saveUser(user)
          .pipe(
            map((u) => new UpdateUser(u)),
            catchError(() => {
              this.blockUI.stop();
              return of(new Failure(['Не удалось сохранить пользователя']));
            })
          )
      )
    );

  constructor(
    private actions$: Actions,
    private authService: AuthService,
    private router: Router
  ) {
  }
}
