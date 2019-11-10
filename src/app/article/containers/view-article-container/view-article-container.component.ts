/*
 * © Copyright
 *
 * view-article-container.component.ts is part of shashkifront.nosync.
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

import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Store } from '@ngrx/store';
import { untilComponentDestroyed } from '@w11k/ngx-componentdestroyed';
import { Observable, of } from 'rxjs';
import { map, switchMap, tap } from 'rxjs/operators';
import { ArticleService } from '../../../core/services/article.service';
import { Article } from '../../../domain';
import { UpsertArticle } from '../../actions/article.actions';
import * as fromArticle from '../../reducers/article.reducer';
import { selectArticleEntitiesByHru } from '../../reducers/article.reducer';

@Component({
  selector: 'app-view-article-container',
  templateUrl: './view-article-container.component.html',
  styles: []
})
export class ViewArticleContainerComponent implements OnInit, OnDestroy {

  article$: Observable<Article>;

  constructor(
    private store: Store<fromArticle.State>,
    private route: ActivatedRoute,
    private articleService: ArticleService
  ) {
  }

  ngOnInit() {
    this.article$ = this.route.params
      .pipe(
        map(params => params['hru']),
        switchMap(hru => this.store.select(selectArticleEntitiesByHru)
          .pipe(
            map(entities => entities[hru]),
            switchMap((a: Article) => {
              if (a.articleBlocks.length > 0) {
                return of(a);
              }
              return this.articleService.fetchArticle(a, true)
                .pipe(
                  tap(filledArticle => this.store.dispatch(new UpsertArticle({article: filledArticle})))
                );
            })
          )),
        untilComponentDestroyed(this)
      );
  }

  ngOnDestroy(): void {
  }

  onUpdateArticle(article: Article) {
    this.store.dispatch(new UpsertArticle({article: article}));
  }
}
