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
import { Observable, throwError } from 'rxjs';
import { catchError, map, switchMap } from 'rxjs/operators';
import { ArticleService } from '../../core/services/article.service';
import { ArticleActionTypes, SaveArticle, SelectArticle } from '../actions/article.actions';

@Injectable()
export class ArticleEffects {

  @Effect()
  save$: Observable<Action> = this.actions$
    .pipe(
      ofType(ArticleActionTypes.SaveArticle),
      map((action: SaveArticle) => action.payload.article),
      switchMap(article => this.articleService.saveArticle(article)),
      map(article => new SelectArticle({article: article})),
      catchError(err => {
        console.log(err);
        return throwError(err);
      })
    );

  constructor(private actions$: Actions,
              private articleService: ArticleService) {
  }

}
