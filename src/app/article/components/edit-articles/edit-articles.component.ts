/*
 * © Copyright
 *
 * edit-articles.component.ts is part of shashkifront.nosync.
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
import { FormArray, FormControl, FormGroup, ValidatorFn, Validators } from '@angular/forms';
import { Store } from '@ngrx/store';
import { forkJoin } from 'rxjs';
import { tap } from 'rxjs/operators';
import { AppConstants } from '../../../core/config/app-constants';
import { ArticleService } from '../../../core/services/article.service';
import { ArticleBlock } from '../../../domain';
import * as fromArticle from '../../reducers/article.reducer';

@Component({
  selector: 'app-edit-articles',
  templateUrl: './edit-articles.component.html',
  styles: []
})
export class EditArticlesComponent implements OnInit {

  @Input() articles: ArticleBlock[];

  articlesFormGroup: FormGroup;
  private titleValidators: ValidatorFn[];
  private contentValidators: ValidatorFn[];

  constructor(
    private store: Store<fromArticle.State>,
    private articleService: ArticleService
  ) {
    this.titleValidators = [
      Validators.minLength(AppConstants.ARTICLE_TITLE_MIN_SYMBOLS),
      Validators.maxLength(AppConstants.ARTICLE_TITLE_MAX_SYMBOLS)
    ];
    this.contentValidators = [Validators.required,
      Validators.minLength(AppConstants.ARTICLE_CONTENT_MIN_SYMBOLS),
      Validators.maxLength(AppConstants.ARTICLE_CONTENT_MAX_SYMBOLS)
    ];
  }

  get articlesControls() {
    return (this.articlesFormGroup.get('articles') as FormArray).controls;
  }

  get articlesFormArray() {
    return (this.articlesFormGroup.get('articles') as FormArray);
  }

  ngOnInit() {
    const articlesControls = this.articles.map(a => new FormGroup({
      id: new FormControl(a.id),
      title: new FormControl(a.title, [...this.titleValidators]),
      content: new FormControl(a.content, [...this.contentValidators]),
      status: new FormControl(a.status)
    }));
    this.articlesFormGroup = new FormGroup({
      articles: new FormArray([...articlesControls])
    });
  }

  onAddArticleClicked() {
    this.articlesFormArray.insert(0, new FormGroup({
      title: new FormControl('', [...this.titleValidators]),
      content: new FormControl('', [...this.contentValidators]),
      status: new FormControl(AppConstants.NEW_STATUS)
    }));
  }

  onArticlesSubmit() {
    const touchedArticles = this.articlesFormArray.controls.filter(c => c.touched).map(c => c.value);
    const saveObservables = touchedArticles.map(a => this.articleService.saveArticleBlock(a));
    forkJoin(saveObservables)
      .pipe(tap(([a]) => console.log(a)))
      .subscribe();
  }

  onDeleteArticle(index: number) {
    this.articlesFormArray.removeAt(index);
  }
}
