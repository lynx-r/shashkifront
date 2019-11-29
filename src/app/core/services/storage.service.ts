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
import { Router } from '@angular/router';
import { CookieService } from 'ngx-cookie-service';
import { LocalStorageService } from 'ngx-store';

const OFFLINE_USER = 'offlineuser';
const EDIT_ARTICLE_STEP_INDEX = 'editarticlestepindex';

const SEP = '-';

function getKey(key: string, suffix: string) {
  return key + suffix;
}

function formatSuffix(suffix: string) {
  return SEP + suffix;
}

@Injectable({
  providedIn: 'root'
})
export class StorageService {

  constructor(
    private storage: LocalStorageService,
    private cookie: CookieService,
    private router: Router,
  ) {
  }

  get(key: string) {
    return this.storage.get(getKey(key, formatSuffix(this.router.url)));
  }

  put(key: string, val: any) {
    this.storage.set(getKey(key, formatSuffix(this.router.url)), val);
  }

  getPref(suffix: string, key: string) {
    return this.storage.get(getKey(key, suffix));
  }

  putPref(suffix: string, key: string, val: any) {
    this.storage.set(getKey(key, suffix), val);
  }

  putUserId(userId: string) {
    const expires = this.addMinutes(new Date(), 600);
    this.cookie.set('shashkiuserid', userId, expires, '/');
  }

  getUserId() {
    return this.cookie.get('shashkiuserid');
  }

  getOfflineUser() {
    return this.storage.get(OFFLINE_USER);
  }

  putOfflineUser(user: any) {
    this.storage.set(OFFLINE_USER, user);
  }

  getStepIndex() {
    return this.get(EDIT_ARTICLE_STEP_INDEX);
  }

  putStepIndex(stepIndex: number) {
    this.put(EDIT_ARTICLE_STEP_INDEX, stepIndex);
  }

  private addMinutes(date, minutes) {
    return new Date(date.getTime() + minutes * 60000);
  }
}
