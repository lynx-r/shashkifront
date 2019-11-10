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
import { Article, ArticleBlock } from '../../../domain';
import { UpsertArticle } from '../../actions/article.actions';
import * as fromArticle from '../../reducers/article.reducer';

@Component({
  selector: 'app-edit-articles',
  templateUrl: './edit-articles.component.html',
  styles: []
})
export class EditArticlesComponent implements OnInit {

  @Input() article: Article;

  articlesFormGroup: FormGroup;

  private readonly titleValidators: ValidatorFn[];
  private readonly contentValidators: ValidatorFn[];

  get articles() {
    return this.article.articleBlocks;
  }

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

  get articlesControls(): FormGroup[] {
    return (this.articlesFormGroup.get('articles') as FormArray).controls as FormGroup[];
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
    this.articleService.addArticleBlockToArticle(this.article.id)
      .pipe(
        tap(articleBlock => {
          this.articlesFormArray.insert(0, new FormGroup({
            title: new FormControl(articleBlock.title, [...this.titleValidators]),
            content: new FormControl(articleBlock.content, [...this.contentValidators]),
            status: new FormControl(articleBlock.status),
          }));
        }),
        tap(articleBlock => {
          console.log(articleBlock);
          const a = {
            ...this.article,
            articleBlocks: [articleBlock, ...this.article.articleBlocks],
            selectedArticleBlock: articleBlock
          };
          this.store.dispatch(new UpsertArticle({article: a}));
        })
      )
      .subscribe();
  }

  onArticlesSubmit() {
    const touchedArticles = this.articlesFormArray.controls.filter(c => c.touched).map(c => c.value);
    const saveObservables = touchedArticles.map(a => this.articleService.saveArticleBlock(a));
    forkJoin(saveObservables)
      .pipe(tap(([a]) => console.log(a)))
      .subscribe();
  }

  onDeleteArticleBlock(index: number) {
    this.articlesFormArray.removeAt(index);
  }

  onSaveArticleBlock(articleBlock: ArticleBlock) {
    const aBlock = {...this.articles.find(a => a.id === articleBlock.id)};
    const updatedABlock = Object.assign(aBlock, articleBlock);
    this.articleService.saveArticleWithArticleBlock(this.article, updatedABlock)
      .pipe(
        tap(article => {
          this.store.dispatch(new UpsertArticle({article: article}));
        })
      )
      .subscribe();
  }

  onMoveUpArticleBlock(a: FormGroup, index: number) {
    if (index === 0) {
      return;
    }
    const upIndex = index - 1;
    const tmpAB = this.articlesFormArray.at(upIndex);
    this.articlesFormArray.removeAt(index);
    this.articlesFormArray.removeAt(upIndex);
    this.articlesFormArray.insert(upIndex, a);
    this.articlesFormArray.insert(index, tmpAB);
  }
}
