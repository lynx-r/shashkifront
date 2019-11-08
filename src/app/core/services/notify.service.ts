/*
 * © Copyright
 *
 * notify.service.ts is part of shashkifront.nosync.
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

import { HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { throwError } from 'rxjs';
import { Failure } from '../actions/general';
import { AppConstants } from '../config/app-constants';
import { profile } from '../config/profile';
import { StorageService } from './storage.service';

@Injectable({
  providedIn: 'root'
})
export class NotifyService {

  constructor(
    private storage: StorageService,
    private toastrService: ToastrService,
  ) {
  }

  private static httpErrorMessage(error: HttpErrorResponse) {
    switch (error.status) {
      case 405:
      case 400:
        return error.error.message;
      default:
        const err = error.error;
        return error.status === 0 ? [AppConstants.FAIL_SERVER_CONNECTION]
          : ((!!err && !!err.message) ? err.message.messages : [error.message]);
    }
  }

  handleError(error: any) {
    const err = error.error;
    if (profile === 'dev') {
      console.log(error);
    }
    if (error.message === 'answer is null') {
      return throwError(new Failure(['Нет контента']));
    }
    let msg = 'Что то пошло не так, попробуйте позже';
    if (err !== undefined) {
      if (err instanceof ErrorEvent) {
        const message = err.message;
        msg = message;
        // A client-side or network error occurred. Handle it accordingly.
        this.error(message);
      } else {
        // The backend returned an unsuccessful response code.
        // The response body may contain clues as to what went wrong,
        const message = NotifyService.httpErrorMessage(error);
        msg = message;
        this.error(message.join(','));
      }
    } else if ('payload' in error) {
      const message = error.payload;
      msg = message;
      this.error(message);
    } else {
      const message = `Ошибка в коде ${err}`;
      msg = message;
      this.error(message);
    }

    // return an ErrorObservable with a userId-facing error message
    return throwError(new Failure([msg]));
  }

  error(message: string) {
    return this.toastrService.error(message);
  }

  info(message: string) {
    return this.toastrService.info(message);
  }

  success(message: string) {
    return this.toastrService.success(message);
  }

}
