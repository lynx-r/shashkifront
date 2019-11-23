/*
 * © Copyright
 *
 * storage.service.ts is part of shashkifront.nosync.
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
import { ChildActivationEnd, Router } from '@angular/router';
import { CookieService } from 'ngx-cookie';
import { LocalStorageService } from 'ngx-store';
import { filter, take } from 'rxjs/operators';

const OFFLINE_USER = 'offlineuser';
const EDIT_ARTICLE_STEP_INDEX = 'editarticlestepindex';

@Injectable({
  providedIn: 'root'
})
export class StorageService {

  private static SEP = '-';
  private suffix: string;

  constructor(
    private storage: LocalStorageService,
    private cookie: CookieService,
    private router: Router,
  ) {
    this.router.events.pipe(
      filter(event => event instanceof ChildActivationEnd),
      take(1),
    ).subscribe((event: ChildActivationEnd) => {
      const url = event.snapshot['_routerState'].url;
      this.suffix = StorageService.formatSuffix(url);
    });
  }

  private static getKey(key: string, suffix: string) {
    return key + suffix;
  }

  private static formatSuffix(suffix: string) {
    return StorageService.SEP + suffix;
  }

  get(key: string) {
    return this.storage.get(StorageService.getKey(key, this.suffix));
  }

  put(key: string, val: any) {
    this.storage.set(StorageService.getKey(key, this.suffix), val);
  }

  getPref(suffix: string, key: string) {
    return this.storage.get(StorageService.getKey(key, suffix));
  }

  putPref(suffix: string, key: string, val: any) {
    this.storage.set(StorageService.getKey(key, suffix), val);
  }

  putUserId(userId: string) {
    this.cookie.put('shashkiuserid', userId);
  }

  getUserId() {
    return this.cookie.get('shashkiuserid');
  }

  // getAuthUser() {
  //   return this.cookie.getObject(AppConstants.AUTH_USER_COOKIE) as UserToken;
  // }
  //
  // putAuthUser(user: UserToken, force?: boolean) {
  //   let options: CookieOptions = {
  //     expires: new Date(Date.now() + (1000 * 60 * 60)),
  //   };
  //   if (profile === 'prod') {
  //     options = {
  //       ...options,
  //       secure: true,
  //     };
  //   }
  //   console.log('!!!!!!!!!!!!!!!!', user);
  //   this.cookie.putObject(AppConstants.AUTH_USER_COOKIE, user, options);
  // }

  getOfflineUser() {
    return this.storage.get(OFFLINE_USER);
  }

  putOfflineUser(user: any) {
    this.storage.set(OFFLINE_USER, user);
  }

  getStepIndex() {
    return this.storage.get(EDIT_ARTICLE_STEP_INDEX);
  }

  putStepIndex(stepIndex: number) {
    this.storage.set(EDIT_ARTICLE_STEP_INDEX, stepIndex);
  }
}
