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

import { Component, Input, OnInit } from '@angular/core';
import { FormControl, FormGroup, ValidatorFn, Validators } from '@angular/forms';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { AppConstants } from '../../../core/config/app-constants';
import { ArticleService } from '../../../core/services/article.service';
import { Article } from '../../../domain';
import { SelectArticle } from '../../actions/article.actions';
import * as fromArticles from '../../reducers/article.reducer';
import { selectCurrentArticlePublished } from '../../reducers/article.reducer';

@Component({
  selector: 'app-edit-article-info',
  templateUrl: './edit-article-info.component.html',
  styles: []
})
export class EditArticleInfoComponent implements OnInit {

  @Input() article: Article;

  articleFormGroup: FormGroup;
  minIntroLength = AppConstants.ARTICLE_INTRO_MIN_SYMBOLS;
  minTitleLength = AppConstants.ARTICLE_TITLE_MIN_SYMBOLS;
  published$: Observable<boolean>;
  DRAFT = AppConstants.ARTICLE_DRAFT_STATUS;
  PUBLISHED = AppConstants.ARTICLE_PUBLISHED_STATUS;

  private readonly titleRequireValidators: ValidatorFn[];
  private readonly introValidators: ValidatorFn[];

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

  constructor(private store: Store<fromArticles.State>,
              private articleService: ArticleService) {
    this.titleRequireValidators = [
      Validators.required,
      Validators.minLength(AppConstants.ARTICLE_TITLE_MIN_SYMBOLS),
      Validators.maxLength(AppConstants.ARTICLE_TITLE_MAX_SYMBOLS)
    ];
    this.introValidators = [
      Validators.required,
      Validators.minLength(AppConstants.ARTICLE_INTRO_MIN_SYMBOLS),
      Validators.maxLength(AppConstants.ARTICLE_INTRO_MAX_SYMBOLS)
    ];
  }

  ngOnInit(): void {
    this.published$ = this.store.select(selectCurrentArticlePublished);
    this.articleFormGroup = new FormGroup({
      id: new FormControl(this.article.id),
      title: new FormControl(this.article.title, this.titleRequireValidators),
      intro: new FormControl(this.article.intro, this.introValidators),
      task: new FormControl(this.article.task),
      status: new FormControl(this.article.status),
      selectedArticleBlockId: new FormControl(this.article.selectedArticleBlockId),
      articleBlockIds: new FormControl(this.article.articleBlockIds),
    });
  }

  onSaveArticle() {
    this.articleService.saveArticle(this.articleFormGroup.value)
      .pipe(
        tap(() => this.articleFormGroup.markAsPristine()),
        tap(aSaved => this.store.dispatch(new SelectArticle({article: aSaved})))
      )
      .subscribe();
  }
}
