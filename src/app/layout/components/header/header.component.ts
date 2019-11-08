/*
 * © Copyright
 *
 * header.component.ts is part of shashkifront.nosync.
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

import { DOCUMENT } from '@angular/common';
import { Component, Inject, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { untilComponentDestroyed } from '@w11k/ngx-componentdestroyed';
import { filter, switchMap, tap } from 'rxjs/operators';
import { environment } from '../../../../environments/environment';
import { AddArticle } from '../../../article/actions/article.actions';
import { Logout, SaveUser } from '../../../core/actions/user';
import { getUserState, RootState } from '../../../core/reducers/reducer.reducer';
import { ArticleService } from '../../../core/services/article.service';
import { DialogService } from '../../../core/services/dialog.service';
import { isPrivateUser } from '../../../core/services/utils';
import { User } from '../../../domain/user';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styles: [`
      .toolbar {
          position: fixed;
          z-index: 1000;
      }
  `]
})
export class HeaderComponent implements OnInit, OnDestroy {

  loading: boolean;
  loggedIn: boolean;
  user: User;

  isStandalone: boolean;

  constructor(private store: Store<RootState>,
              private router: Router,
              private articleService: ArticleService,
              private dialogService: DialogService,
              @Inject(DOCUMENT) public document: Document
  ) {
  }

  ngOnInit() {
    this.checkStandalone();
    this.loading = true;
    this.store.select(getUserState)
      .pipe(
        filter(user => !!user),
        tap((user) => {
          this.loggedIn = isPrivateUser(user);
          this.user = user;
          this.loading = user === undefined;
          // timer(1000).subscribe(() => this.loading = user === undefined);
        }),
        untilComponentDestroyed(this)
      )
      .subscribe();
  }

  ngOnDestroy(): void {
  }

  openCreateArticleDialog() {
    this.dialogService.createArticle()
      .pipe(
        filter(a => !!a),
        switchMap(aReq => this.articleService.createArticle(aReq)),
        tap(article => this.store.dispatch(new AddArticle({article: article}))),
        tap(article => this.router.navigate(['/article/edit', article.humanReadableUrl]))
      )
      .subscribe();
  }

  onThemeChange(dark: boolean) {
    if (dark) {
      this.user = {...this.user, theme: 'unicorn-dark-theme'};
    } else {
      this.user = {...this.user, theme: 'default'};
    }
    this.store.dispatch(new SaveUser(this.user));
  }

  onLogout() {
    this.store.dispatch(new Logout());
  }

  checkStandalone() {
    if (environment.browser) {
      this.isStandalone = (window.matchMedia('(display-mode: standalone)').matches);
    }
  }
}
