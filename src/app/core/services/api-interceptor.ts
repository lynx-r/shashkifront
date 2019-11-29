/*
 * © Copyright
 *
 * api-interceptor.ts is part of shashkifront.nosync.
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

import { HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map, switchMap, take } from 'rxjs/operators';
import { AppConstants } from '../config/app-constants';
import { AuthService } from './auth.service';

@Injectable()
export class ApiInterceptor implements HttpInterceptor {

  constructor(private authService: AuthService) {
  }

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    return this.authService.jwtToken$
      .pipe(
        map((token: string) => {
          let clonedRequest = req.clone();
          if (!!token) {
            clonedRequest = clonedRequest.clone(
              {
                headers:
                  clonedRequest.headers
                    .append(AppConstants.JWT_AUTHORIZATION, 'Bearer ' + token),
              },
            );
          }
          return next.handle(clonedRequest);
        }),
        take(1),
        switchMap((value) => {
          return value;
        }),
      );
  }

}
