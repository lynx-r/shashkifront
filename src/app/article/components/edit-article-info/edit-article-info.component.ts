/*
 * © Copyright
 *
 * edit-article-info.component.ts is part of shashkifront.nosync.
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

import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { Store } from '@ngrx/store';
import { switchMap, tap } from 'rxjs/operators';
import { AppConstants } from '../../../core/config/app-constants';
import { ArticleService } from '../../../core/services/article.service';
import { Article } from '../../../domain';
import { SelectArticle } from '../../actions/article.actions';
import * as fromArticles from '../../reducers/article.reducer';

@Component({
  selector: 'app-edit-article-info',
  templateUrl: './edit-article-info.component.html',
  styles: []
})
export class EditArticleInfoComponent implements OnInit {

  @Input() article: Article;
  @Input() articleFormGroup: FormGroup;

  @Output() saveArticle = new EventEmitter();

  minIntroLength = AppConstants.ARTICLE_INTRO_MIN_SYMBOLS;
  minTitleLength = AppConstants.ARTICLE_TITLE_MIN_SYMBOLS;
  DRAFT = AppConstants.ARTICLE_DRAFT_STATUS;
  PUBLISHED = AppConstants.ARTICLE_PUBLISHED_STATUS;

  get articleTitle() {
    return (this.articleFormGroup.get('title') as FormControl);
  }

  get task() {
    return this.article.task;
  }

  get humanReadableUrl() {
    return this.article.humanReadableUrl;
  }

  get articleIntro() {
    return (this.articleFormGroup.get('intro') as FormControl);
  }

  get articleStatus() {
    return (this.articleFormGroup.get('status') as FormControl);
  }

  constructor(private store: Store<fromArticles.State>,
              private articleService: ArticleService) {
  }

  ngOnInit(): void {
    this.articleStatus.valueChanges
      .pipe(
        switchMap((status) => {
          const a = {
            ...this.article,
            status: status
          };
          return this.articleService.saveArticle(a);
        }),
        tap(a => this.store.dispatch(new SelectArticle({article: a})))
      )
      .subscribe();
  }
}
