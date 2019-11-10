/*
 * © Copyright
 *
 * edit-article-blocks.component.ts is part of shashkifront.nosync.
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
  selector: 'app-edit-article-blocks',
  templateUrl: './edit-article-blocks.component.html',
  styles: []
})
export class EditArticleBlocksComponent implements OnInit {

  @Input() article: Article;

  articleBlockFormArray: FormArray;
  articleFormGroup: FormGroup;

  DRAFT = AppConstants.ARTICLE_DRAFT_STATUS;
  PUBLISHED = AppConstants.ARTICLE_PUBLISHED_STATUS;
  minIntroLength = AppConstants.ARTICLE_INTRO_MIN_SYMBOLS;
  minTitleLength = AppConstants.ARTICLE_TITLE_MIN_SYMBOLS;

  private readonly titleValidators: ValidatorFn[];
  private readonly introValidators: ValidatorFn[];
  private readonly contentValidators: ValidatorFn[];

  get articleBlocks() {
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

  get published() {
    return this.article.status === AppConstants.ARTICLE_PUBLISHED_STATUS;
  }

  get articleTitle() {
    return (this.articleFormGroup.get('title') as FormControl);
  }

  get articleIntro() {
    return (this.articleFormGroup.get('intro') as FormControl);
  }

  get articleStatus() {
    return (this.articleFormGroup.get('status') as FormControl);
  }

  get articlesControls(): FormGroup[] {
    return this.articleBlockFormArray.controls as FormGroup[];
  }

  ngOnInit() {
    this.createArticleBlockFormArray(this.article);
    this.articleFormGroup = new FormGroup({
      id: new FormControl(this.article.id),
      title: new FormControl(this.article.title, [Validators.required, ...this.titleValidators]),
      intro: new FormControl(this.article.intro, this.introValidators),
      status: new FormControl(this.article.status),
      task: new FormControl(this.article.task),
      selectedArticleBlockId: new FormControl(this.article.selectedArticleBlockId),
      articleBlockIds: new FormControl(this.article.articleBlockIds),
    });
  }

  onAddArticleClicked() {
    this.articleService.addArticleBlockToArticle(this.article.id)
      .pipe(
        tap(articleBlock => {
          this.articleBlockFormArray.insert(0, new FormGroup({
            id: new FormControl(articleBlock.id),
            title: new FormControl(articleBlock.title, [...this.titleValidators]),
            content: new FormControl(articleBlock.content, [...this.contentValidators]),
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
        tap(articleSaved => this.createArticleBlockFormArray(articleSaved)),
        tap(aSaved => this.store.dispatch(new UpsertArticle({article: aSaved})))
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

  onSelectArticleBlock(a: FormGroup) {
    this.articleService.selectArticleBlock(this.article, a.value)
      .pipe(
        tap(articleSaved => this.store.dispatch(new UpsertArticle({article: articleSaved})))
      )
      .subscribe();
  }

  private createArticleBlockFormArray(article: Article) {
    const published = article.status === AppConstants.ARTICLE_PUBLISHED_STATUS;
    this.articleBlockFormArray = new FormArray([
      ...article.articleBlocks.map(a => new FormGroup({
        id: new FormControl(a.id),
        title: new FormControl({value: a.title, disabled: published}, [...this.titleValidators]),
        content: new FormControl({value: a.content, disabled: published}, [...this.contentValidators]),
        state: new FormControl(a.state)
      }))
    ]);
  }
}
