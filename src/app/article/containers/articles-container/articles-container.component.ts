/*
 * © Copyright
 *
 * articles-container.component.ts is part of shashkifront.nosync.
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

import { AfterViewInit, Component, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { getIsPrivateUserState } from '../../../core/reducers/reducer.reducer';
import { ArticleService } from '../../../core/services/article.service';
import * as fromArticle from '../../reducers/article.reducer';
import { AbstractArticlesContainer } from '../abstract-articles-container';

@Component({
  selector: 'app-articles-container',
  templateUrl: './articles-container.component.html',
  styles: [``],
})
export class ArticlesContainerComponent extends AbstractArticlesContainer implements OnInit, AfterViewInit {

  displayedColumns: string[] = ['title', 'intro', 'task', 'createdAt'];
  private authed: boolean;

  get articlesNameEnd() {
    return this.authed && 'Все Разборы';
  }

  constructor(
    protected store: Store<fromArticle.State>,
    protected articleService: ArticleService,
  ) {
    super(store, articleService);
  }

  ngOnInit(): void {
    this.store.select(getIsPrivateUserState).subscribe(authed => (this.authed = authed));
  }

  ngAfterViewInit(): void {
    this.fetchData().subscribe();
  }

}
