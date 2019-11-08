/*
 * © Copyright
 *
 * auth.service.ts is part of shashkifront.nosync.
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

import { HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Store } from '@ngrx/store';
import * as Fingerprint2 from 'fingerprintjs2';
import { BehaviorSubject, Observable, of, throwError } from 'rxjs';
import { fromPromise } from 'rxjs/internal-compatibility';
import { catchError, switchMap, tap } from 'rxjs/operators';
import { environment } from '../../../environments/environment';
import { RegisteredUser, User, UserCredentials, UserToken } from '../../domain';
import { Failure } from '../actions/general';
import { ROLE_GUEST } from '../config/app-constants';
import { RootState } from '../reducers/reducer.reducer';
import { ApiBase } from './api-base';
import { NotifyService } from './notify.service';
import { StorageService } from './storage.service';

declare var window: any;

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  jwtToken$ = new BehaviorSubject<string>(null);
  fingerprint: string;

  constructor(
    private api: ApiBase,
    private store: Store<RootState>,
    private storage: StorageService,
    private notifyService: NotifyService,
  ) {
  }

  private static urlBase64Decode(str: string) {
    let output = str.replace(/-/g, '+').replace(/_/g, '/');
    switch (output.length % 4) {
      case 0:
        break;
      case 2:
        output += '==';
        break;
      case 3:
        output += '=';
        break;
      default:
        // tslint:disable-next-line:no-string-throw
        throw 'Illegal base64url string!';
    }
    return decodeURIComponent(window.escape(window.atob(output)));
  }

  private static decodeToken(token: string = '') {
    if (token === null || token === '') {
      return {'upn': ''};
    }
    const parts = token.split('.');
    if (parts.length !== 3) {
      throw new Error('JWT must have 3 parts');
    }
    const decoded = AuthService.urlBase64Decode(parts[1]);
    if (!decoded) {
      throw new Error('Cannot decode the token');
    }
    return JSON.parse(decoded);
  }

  fingerPrint() {
    return fromPromise(new Promise((resolve) => {
        if (!!window.requestIdleCallback) {
          window.requestIdleCallback(() => this.resolveFingerprint(resolve));
        } else {
          setTimeout(() => this.resolveFingerprint(resolve), 500);
        }
      })
    );
  }

  tryLogin(): Observable<User> {
    if (!environment.browser) {
      return of(<User>{userId: null, email: ''});
    }
    return this.fingerPrint()
      .pipe(
        switchMap((fp) =>
          this.api.post('/public/guest', {fingerprint: fp})),
        switchMap((userToken: UserToken) => this.processLogin(userToken)),
        catchError((err) => {
          if (err.status === 0) {
            // нет интернета
            return of(this.storage.getOfflineUser());
          } else {
            const message = 'Не удалось получить токен';
            this.notifyService.error(message);
            return of(<User>{userId: null, email: ''});
          }
        }),
      );
  }

  register(registerUser: RegisteredUser): Observable<User> {
    return this.api
      .post('/auth/register', registerUser)
      .pipe(
        switchMap((userToken) => this.processLogin(userToken)),
        catchError(error => {
          return this.notifyService.handleError(error);
        })
      );
  }

  login(credentials: UserCredentials): Observable<User> {
    const headers = new HttpHeaders()
      .set('Content-Type', 'application/x-www-form-urlencoded');
    const body = `email=${credentials.email}&password=${credentials.password}`;
    return this.api.post('/auth/token/' + this.fingerprint, body, headers)
      .pipe(
        switchMap((userToken) => this.processLogin(userToken)),
        catchError(() => {
          return throwError(new Failure(['Не верный логин или пароль']));
        })
      );
  }

  logout() {
    return this.api.postPrivate('/account/logout/' + this.fingerprint, {})
      .pipe(
        switchMap((userToken: UserToken) => this.processLogin(userToken, false)),
        catchError((error) => {
          return of(new Failure(error));
        })
      );
  }

  saveUser(user: User) {
    return this.api.putPrivate('/account', user);
  }

  private resolveFingerprint(resolve) {
    Fingerprint2.get((components) => {
      const fp = Fingerprint2.x64hash128(components.map((pair) => pair.value).join(), 31);
      this.fingerprint = fp;
      resolve(fp);
    });
  }

  private processLogin(token: UserToken, requestUser = true): Observable<User> {
    if (!token) {
      return throwError({error: {message: {messages: ['Не удалось получить токен']}}});
    }
    const tokenDecoded = AuthService.decodeToken(token.token);
    this.storage.putUserId(tokenDecoded.userId);
    this.jwtToken$.next(token.token);
    if (requestUser) {
      return this.api.getPrivate('/account/userdetails')
        .pipe(
          tap(user => this.storage.putOfflineUser(user))
        );
    }
    return of(<User>{email: tokenDecoded.sub, userId: tokenDecoded.userId, userAuthorities: [ROLE_GUEST]});
  }
}
