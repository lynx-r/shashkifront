/*
 * © Copyright
 *
 * article-exists.ts is part of shashkifront.nosync.
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
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot } from '@angular/router';
import { select, Store } from '@ngrx/store';
import { Observable, of } from 'rxjs';
import { catchError, map, switchMap, take, tap, } from 'rxjs/operators';
import { AddArticle } from '../../article/actions/article.actions';
import * as fromArticle from '../../article/reducers/article.reducer';

import { ArticleService } from '../../core/services/article.service';
import { AuthService } from '../../core/services/auth.service';
import { NotifyService } from '../../core/services/notify.service';
import { Article } from '../../domain';

/**
 * Guards are hooks into the route resolution process, providing an opportunity
 * to inform the router's navigation process whether the route should continue
 * to activate this route. Guards must return an observable of true or false.
 */
@Injectable({
  providedIn: 'root'
})
export class ArticleExistsGuard implements CanActivate {
  constructor(
    private store: Store<fromArticle.State>,
    private articleService: ArticleService,
    private router: Router,
    private authService: AuthService,
    private errorHandling: NotifyService
  ) {
  }

  /**
   * This method creates an observable that waits for the `loaded` property
   * of the collection state to turn `true`, emitting one time once loading
   * has finished.
   */
  waitForCollectionToLoad(): Observable<boolean> {
    return (
      this.store.pipe(
        select(fromArticle.selectArticleTotal),
        map(total => total > 0),
        map(total => Object.keys(total).length > 0),
        take(1)
      )
    );
  }

  /**
   * This method checks if a article with the given ID is already registered
   * in the Store
   */
  hasArticleInStore(hru: string): Observable<boolean> {
    if (hru == null) {
      return of(false);
    }
    return this.store
      .pipe(
        select(fromArticle.selectArticleEntitiesByHru),
        map(entities => !!entities[hru]),
        take(1),
        catchError((err) => {
          this.router.navigate(['/404']);
          return of(false);
        }),
      );
  }

  /**
   * This method loads a article with the given ID from the API and caches
   * it in the store, returning `true` or `false` if it was found.
   * id - article id
   * bbid - selectedBoardBoxId
   */
  hasArticleInApi(hru: string, privateUser: boolean): Observable<boolean> {
    if (hru == null) {
      this.router.navigate(['/404']);
      return of(false);
    }
    return this.articleService
      .findArticleByHru(hru, privateUser)
      .pipe(
        tap((a: Article) => this.store.dispatch(new AddArticle({article: a}))),
        map(apiArticle => !!apiArticle),
        catchError((err) => {
          this.errorHandling.error('Статья не найдена');
          this.router.navigate(['/404']);
          return of(false);
        })
      );
  }

  /**
   * `hasArticle` composes `hasArticleInStore` and `hasArticleInApi`. It first checks
   * if the article is in store, and if not it then checks if it is in the
   * API.
   */
  hasArticle(hru: string, privateUser: boolean): Observable<boolean> {
    return this.hasArticleInStore(hru)
      .pipe(
        switchMap((inStore) => {
          if (inStore) {
            return of(inStore);
          }
          return this.hasArticleInApi(hru, privateUser);
        }),
      );
  }

  /**
   * This is the actual method the router will call when our guard is run.
   *
   * Our guard waits for the collection to load, then it checks if we need
   * to request a article from the API or if we already have it in our cache.
   * If it finds it in the cache or in the API, it returns an Observable
   * of `true` and the route is rendered successfully.
   *
   * If it was unable to find it in our cache or in the API, this guard
   * will return an Observable of `false`, causing the router to move
   * on to the next candidate route. In this case, it will move on
   * to the 404 page.
   */
  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean> {
    return this.waitForCollectionToLoad()
      .pipe(
        switchMap(() =>
          this.hasArticle(route.params['hru'], route.data.privateUser),
        )
      );
  }
}
