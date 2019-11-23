/*
 * © Copyright
 *
 * preview-and-publish-article.component.ts is part of shashkifront.nosync.
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

import { Component, Input, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { tap } from 'rxjs/operators';
import { AppConstants } from '../../../core/config/app-constants';
import { ArticleService } from '../../../core/services/article.service';
import { Article } from '../../../domain';
import { SelectArticle } from '../../actions/article.actions';
import * as fromArticles from '../../reducers/article.reducer';

@Component({
  selector: 'app-preview-and-publish-article',
  templateUrl: './preview-and-publish-article.component.html',
  styles: []
})
export class PreviewAndPublishArticleComponent implements OnInit {

  @Input() article: Article;

  published: boolean;

  constructor(private store: Store<fromArticles.State>,
              private articleService: ArticleService) {
  }

  ngOnInit() {
    this.published = this.article.status === AppConstants.ARTICLE_PUBLISHED_STATUS;
  }

  onSaveArticle() {
    const status = this.published ? AppConstants.ARTICLE_DRAFT_STATUS : AppConstants.ARTICLE_PUBLISHED_STATUS;
    const article = {
      ...this.article,
      status: status
    };
    this.published = !this.published;
    this.articleService.saveArticle(article)
      .pipe(
        tap(aSaved => this.store.dispatch(new SelectArticle({article: aSaved})))
      )
      .subscribe();
  }

}
