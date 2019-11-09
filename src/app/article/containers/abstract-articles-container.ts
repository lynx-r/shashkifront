/*
 * © Copyright
 *
 * abstract-articles-container.ts is part of shashkifront.nosync.
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

import { ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { Store } from '@ngrx/store';
import { BehaviorSubject, merge, Observable, of, throwError } from 'rxjs';
import { catchError, debounceTime, map, startWith, switchMap, tap } from 'rxjs/operators';
import { ArticleService } from '../../core/services/article.service';
import { Article } from '../../domain';
import { ArticlesResponse } from '../../domain/articles-response';
import { UpsertArticles } from '../actions/article.actions';
import * as fromArticle from '../reducers/article.reducer';

export class AbstractArticlesContainer {

  @ViewChild(MatPaginator, {static: false}) paginator: MatPaginator;
  @ViewChild(MatSort, {static: false}) sort: MatSort;

  isLoadingResults = true;
  searchSubject = new BehaviorSubject<string>('');
  resultsLength = 0;
  pageSizeOptions = [10, 25, 50];

  data: Article[] = [];

  privateUser: boolean;

  constructor(protected store: Store<fromArticle.State>,
              protected articleService: ArticleService) {
  }

  applyFilter(search: string) {
    const value = search.trim();
    this.searchSubject.next(value);
    this.paginator.firstPage();
  }

  fetchData() {
    this.sort.sortChange.subscribe(() => this.paginator.pageIndex = 0);

    return merge(this.sort.sortChange, this.searchSubject, this.paginator.page)
      .pipe(
        startWith({}),
        this.fetchArticles(),
        catchError(err => {
          console.log(err);
          return throwError(err);
        })
      );
  }

  protected fetchArticles(): (s) => Observable<Article[]> {
    return (source) => source
      .pipe(
        debounceTime(1000),
        tap(() => this.isLoadingResults = true),
        switchMap(() => this.articleService
          .listArticles(
            {
              sort: this.sort.active,
              sortDirection: this.sort.direction,
              page: this.paginator.pageIndex,
              pageSize: this.paginator.pageSize,
              contains: this.searchSubject.getValue()
            }, this.privateUser)
        ),
        map((data: ArticlesResponse) => {
          // Flip flag to show that loading has finished.
          this.isLoadingResults = false;
          this.resultsLength = data.totalCount;

          return data.articles;
        }),
        tap((articles: Article[]) => this.data = articles),
        tap((articles: Article[]) => this.store.dispatch(new UpsertArticles({articles: articles}))),
        catchError((err) => {
          console.log(err);
          this.isLoadingResults = false;
          return of([]);
        })
      );
  }

}
