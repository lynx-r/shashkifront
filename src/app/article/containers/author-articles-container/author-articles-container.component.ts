/*
 * © Copyright
 *
 * author-articles-container.component.ts is part of shashkifront.nosync.
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
import { ArticleService } from '../../../core/services/article.service';
import { MediaService } from '../../../core/services/media.service';
import * as fromArticle from '../../reducers/article.reducer';
import { AbstractArticlesContainer } from '../abstract-articles-container';

@Component({
  selector: 'app-author-articles-container',
  templateUrl: './author-articles-container.component.html',
  styles: [``],
})
export class AuthorArticlesContainerComponent extends AbstractArticlesContainer implements OnInit, AfterViewInit {

  displayedColumns: string[] = ['title', 'intro', 'task', 'status', 'updatedAt'];

  status = {
    'DRAFT': 'Черновик',
    'PUBLISHED': 'Опубликовано'
  };

  mobile: boolean;

  constructor(
    protected store: Store<fromArticle.State>,
    protected articleService: ArticleService,
    private mediaService: MediaService
  ) {
    super(store, articleService);
  }

  ngOnInit(): void {
    this.privateUser = true;
    this.mediaService.mobile$.subscribe(mobile => this.mobile = mobile);
  }

  ngAfterViewInit(): void {
    this.afterViewInit();
  }

}
