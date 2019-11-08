/*
 * © Copyright
 *
 * dialog.service.ts is part of shashkifront.nosync.
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
import { MatDialog, MatDialogRef } from '@angular/material';
import { tap } from 'rxjs/operators';
import { Article } from '../../domain';
import { AppConstants } from '../config/app-constants';
import { CreateArticleDialogComponent } from '../dialogs/create-article-dialog/create-article-dialog.component';
import { InputDialogComponent } from '../dialogs/create-article-dialog/input-dialog.component';
import { StorageService } from './storage.service';

@Injectable({
  providedIn: 'root'
})
export class DialogService {

  private _width = '600px';

  constructor(private dialog: MatDialog,
              private storage: StorageService
  ) {
  }

  createArticle() {
    let dialogRef: MatDialogRef<CreateArticleDialogComponent>;

    const initArticle = this.getCreateArticleRequest();
    dialogRef = this.dialog.open(CreateArticleDialogComponent, {
      data: initArticle,
      width: this._width,
    });

    return dialogRef
      .afterClosed()
      .pipe(
        tap(result =>
          !!result && this.storage.putPref('', AppConstants.ARTICLE_CREATE_COOKIE, result)
        )
      );
  }

  // loadPdn() {
  //   let dialogRef: MatDialogRef<LoadPdnDialogComponent>;
  //
  //   const init = this.getImportPdnRequest();
  //   dialogRef = this.dialog.open(LoadPdnDialogComponent, {
  //     data: {
  //       ...init,
  //     },
  //     width: this._width,
  //   });
  //
  //   return dialogRef
  //     .afterClosed().pipe(
  //       tap(result =>
  //         !!result && this.storage.putPref('',
  //         AppConstants.IMPORT_PDN_COOKIE, result)
  //       ));
  // }

  subscriberName() {
    let dialogRef: MatDialogRef<InputDialogComponent>;

    dialogRef = this.dialog.open(InputDialogComponent, {
      data: {title: 'Как к вам обращаться?', inputs: [{placeholder: 'Ваше имя'}], buttonOk: 'Подписаться'},
      width: this._width,
    });

    return dialogRef.afterClosed();
  }

  remindPasswordForUsername() {
    let dialogRef: MatDialogRef<InputDialogComponent>;

    dialogRef = this.dialog.open(InputDialogComponent, {
      data: {
        title: 'Восстановление пароля', inputs: [
          {placeholder: 'Ваш email?'},
          {placeholder: 'Электронная почта на которую отправить пароль'}
        ],
        buttonOk: 'Далее'
      },
      width: this._width,
    });

    return dialogRef.afterClosed();
  }

  private getCreateArticleRequest(): Article {
    let articleInit: any = this.storage.getPref('',
      AppConstants.ARTICLE_CREATE_COOKIE
    );
    if (!articleInit) {
      const title = AppConstants.CREATE_ARTICLE_NEW_ARTICLE_TITLE;
      articleInit = {
        title: title,
        humanReadableUrl: title,
        notation: {
          rule: 'RUSSIAN',
          player: 'WHITE'
        }
      };
      this.storage.putPref('',
        AppConstants.ARTICLE_CREATE_COOKIE,
        articleInit
      );
    }
    return articleInit;
  }

  // private getImportPdnRequest(): CreateArticleRequest {
  //   let importPdnInit: any = this.storage.getPref('',
  //     AppConstants.IMPORT_PDN_COOKIE
  //   );
  //   if (!importPdnInit) {
  //     importPdnInit = AppConstants.IMPORT_PDN_INIT;
  //     this.storage.putPref('',
  //       AppConstants.IMPORT_PDN_COOKIE,
  //       importPdnInit
  //     );
  //   }
  //   return importPdnInit;
  // }
}
