/*
 * © Copyright
 *
 * article.effects.ts is part of shashkifront.nosync.
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
import { Actions, Effect, ofType } from '@ngrx/effects';
import { Action } from '@ngrx/store';
import { BlockUI, NgBlockUI } from 'ng-block-ui';
import { Observable, throwError } from 'rxjs';
import { catchError, map, switchMap, tap } from 'rxjs/operators';
import { AppConstants } from '../../core/config/app-constants';
import { ArticleService } from '../../core/services/article.service';
import { ArticleActionTypes, SaveArticle, SelectArticle } from '../actions/article.actions';

@Injectable()
export class ArticleEffects {

  @BlockUI() blockUI: NgBlockUI;

  @Effect()
  save$: Observable<Action> = this.actions$
    .pipe(
      ofType(ArticleActionTypes.SaveArticle),
      tap(() => this.blockUI.start(AppConstants.CREATING_ARTICLE_MESSAGE)),
      map((action: SaveArticle) => action.payload.article),
      switchMap(article => this.articleService.saveArticle(article)),
      map(article => new SelectArticle({article: article})),
      tap(() => this.blockUI.stop()),
      catchError(err => {
        console.log(err);
        this.blockUI.stop();
        return throwError(err);
      })
    );

  constructor(private actions$: Actions,
              private articleService: ArticleService) {
  }

}
