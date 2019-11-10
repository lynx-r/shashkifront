/*
 * © Copyright
 *
 * edit-article.component.ts is part of shashkifront.nosync.
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
import { tap } from 'rxjs/operators';
import { AppConstants } from '../../../core/config/app-constants';
import { ArticleService } from '../../../core/services/article.service';
import { Article, ArticleBlock } from '../../../domain';
import { UpsertArticle } from '../../actions/article.actions';
import * as fromArticle from '../../reducers/article.reducer';

@Component({
  selector: 'app-edit-article',
  templateUrl: './edit-article.component.html',
  styles: []
})
export class EditArticleComponent implements OnInit {

  @Input() article: Article;

  articleFormGroup: FormGroup;
  articleBlockFormArray: FormArray;

  private readonly titleValidators: ValidatorFn[];
  private readonly titleRequireValidators: ValidatorFn[];
  private readonly introValidators: ValidatorFn[];
  private readonly contentValidators: ValidatorFn[];

  constructor(
    private store: Store<fromArticle.State>,
    private articleService: ArticleService
  ) {
    this.titleValidators = [
      Validators.minLength(AppConstants.ARTICLE_TITLE_MIN_SYMBOLS),
      Validators.maxLength(AppConstants.ARTICLE_TITLE_MAX_SYMBOLS)
    ];
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
    this.contentValidators = [Validators.required,
      Validators.minLength(AppConstants.ARTICLE_CONTENT_MIN_SYMBOLS),
      Validators.maxLength(AppConstants.ARTICLE_CONTENT_MAX_SYMBOLS)
    ];
  }

  get articleBlocks() {
    return this.article.articleBlocks;
  }

  get published() {
    return this.article.status === AppConstants.ARTICLE_PUBLISHED_STATUS;
  }

  ngOnInit(): void {
    this.createArticleFormGroups(this.article);
  }

  onAddArticleClicked(event: { formControl: FormControl, index: number }) {
    this.articleService.addArticleBlockToArticle(this.article.id)
      .pipe(
        tap(articleBlock => {
          this.articleBlockFormArray.insert(0, new FormGroup({
            id: new FormControl(articleBlock.id),
            title: new FormControl(articleBlock.title, this.titleRequireValidators),
            content: new FormControl(articleBlock.content, this.contentValidators),
            state: new FormControl(articleBlock.state),
          }));
        }),
        tap(articleBlock => {
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

  onSaveArticle() {
    const abIds = this.articleBlockFormArray.value.map((ab: ArticleBlock) => ab.id);
    const article = {
      ...this.articleFormGroup.value,
      articleBlockIds: abIds
    };
    this.articleService.saveArticle(article)
      .pipe(
        tap(aSaved => this.createArticleFormGroups(aSaved)),
        tap(aSaved => this.store.dispatch(new UpsertArticle({article: aSaved})))
      )
      .subscribe();
  }

  onSelectArticleBlock(a: FormGroup) {
    const abIds = this.articleBlockFormArray.value.map((ab: ArticleBlock) => ab.id);
    const article = {
      ...this.articleFormGroup.value,
      articleBlockIds: abIds
    };
    this.articleService.selectArticleBlock(article, a.value.id)
      .pipe(
        tap(aSaved => this.createArticleFormGroups(aSaved)),
        tap(articleSaved => this.store.dispatch(new UpsertArticle({article: articleSaved})))
      )
      .subscribe();
  }

  onDeleteArticleBlock(a: FormGroup, index: number) {
    this.articleBlockFormArray.removeAt(index);
    const aId = a.value.id;
    this.articleService.deleteArticleBlock(this.article.id, aId)
      .subscribe();
  }

  onSaveArticleBlock(articleBlock: ArticleBlock) {
    const aBlock = {...this.articleBlocks.find(a => a.id === articleBlock.id)};
    const updatedABlock = Object.assign(aBlock, articleBlock);
    this.articleService.saveArticleWithArticleBlock(this.article, updatedABlock)
      .pipe(
        tap(aSaved => this.createArticleFormGroups(aSaved)),
        tap(article => this.store.dispatch(new UpsertArticle({article: article})))
      )
      .subscribe();
  }

  onMoveUpArticleBlock(a: FormGroup, index: number) {
    if (index === 0) {
      return;
    }
    const upIndex = index - 1;
    const tmpAB = this.articleBlockFormArray.at(upIndex);
    this.articleBlockFormArray.removeAt(index);
    this.articleBlockFormArray.removeAt(upIndex);
    this.articleBlockFormArray.insert(upIndex, a);
    this.articleBlockFormArray.insert(index, tmpAB);
    this.onSaveArticle();
  }

  onMoveDownArticleBlock(a: FormGroup, index: number) {
    if (index === this.articleBlockFormArray.length - 1) {
      return;
    }
    const downIndex = index + 1;
    const tmpAB = this.articleBlockFormArray.at(downIndex);
    this.articleBlockFormArray.removeAt(downIndex);
    this.articleBlockFormArray.removeAt(index);
    this.articleBlockFormArray.insert(index, tmpAB);
    this.articleBlockFormArray.insert(downIndex, a);
    this.onSaveArticle();
  }

  private createArticleFormGroups(article: Article) {
    const published = article.status === AppConstants.ARTICLE_PUBLISHED_STATUS;
    this.articleBlockFormArray = new FormArray([
      ...article.articleBlocks.map((a, index) => new FormGroup({
        id: new FormControl(a.id),
        title: new FormControl({
          value: a.title,
          disabled: published
        }, index === 0 ? this.titleRequireValidators : this.titleValidators),
        content: new FormControl({value: a.content, disabled: published}, this.contentValidators),
        state: new FormControl(a.state)
      }))
    ]);
    this.articleFormGroup = new FormGroup({
      id: new FormControl(article.id),
      title: new FormControl(article.title, this.titleRequireValidators),
      intro: new FormControl(article.intro, this.introValidators),
      status: new FormControl(article.status),
      task: new FormControl(article.task),
      selectedArticleBlockId: new FormControl(article.selectedArticleBlockId),
      articleBlockIds: new FormControl(article.articleBlockIds),
    });
  }
}
