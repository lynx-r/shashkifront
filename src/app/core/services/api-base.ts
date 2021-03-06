/*
 * © Copyright
 *
 * api-base.ts is part of shashkifront.nosync.
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

import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import configuration from '../config/config.json';
import { profile } from '../config/profile';
import { StorageService } from './storage.service';

@Injectable({
  providedIn: 'root'
})
export class ApiBase {

  constructor(protected http: HttpClient,
              private storage: StorageService
  ) {
  }

  static getConfig() {
    return configuration[profile];
  }

  authPost(resource: string, data: any, headers?: any): Observable<any> {
    return this.http.post(this.getAuthApiPath() + resource, data, {
      headers: headers
    });
  }

  authPut(resource: string, data: any, options?: any): Observable<any> {
    return this.http.put(this.getAuthApiPath() + resource, data, options);
  }

  authPatch(resource: string, data: any) {
    return this.http.patch(this.getAuthApiPath() + resource, data);
  }

  authDelete(resource: string) {
    return this.http.delete(this.getAuthApiPath() + resource);
  }

  authGet(resource: string, params?: any): Observable<any> {
    return this.http.get(this.getAuthApiPath() + resource, {
      params: params
    });
  }

  post(resource: string, data: any, headers?: any, params?: any): Observable<any> {
    return this.http.post(this.getApiPath() + resource, data, {
      params: params,
      headers: headers
    });
  }

  get(resource: string, params?: any): Observable<any> {
    return this.http.get(this.getApiPath() + resource, {
      params: params
    });
  }

  private getAuthApiPath() {
    return ApiBase.getConfig().api + '/user/' + this.storage.getUserId();
  }

  private getApiPath() {
    return ApiBase.getConfig().api;
  }
}
