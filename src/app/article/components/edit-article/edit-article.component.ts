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

import { Component, Input, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { FormArray, FormControl, FormGroup, ValidatorFn, Validators } from '@angular/forms';
import { Store } from '@ngrx/store';
import { tap } from 'rxjs/operators';
import { AppConstants } from '../../../core/config/app-constants';
import { ArticleService } from '../../../core/services/article.service';
import { Article, ArticleBlock } from '../../../domain';
import { SelectArticle } from '../../actions/article.actions';
import * as fromArticle from '../../reducers/article.reducer';
import { selectCurrentArticlePublished } from '../../reducers/article.reducer';

@Component({
  selector: 'app-edit-article',
  templateUrl: './edit-article.component.html',
  styles: []
})
export class EditArticleComponent implements OnInit, OnChanges {

  @Input() article: Article;

  articleFormGroup: FormGroup;
  articleBlockFormArray: FormArray;

  private readonly titleValidators: ValidatorFn[];
  private readonly titleRequireValidators: ValidatorFn[];
  private readonly introValidators: ValidatorFn[];
  private readonly contentValidators: ValidatorFn[];

  constructor(
    private store: Store<fromArticle.State>,
    private articleService: ArticleService,
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
    return this.articleBlockFormArray.value;
  }

  get published() {
    return this.article.status === AppConstants.ARTICLE_PUBLISHED_STATUS;
  }

  ngOnInit(): void {
    this.createArticleFormGroups();
    this.store.select(selectCurrentArticlePublished)
      .pipe(
        tap(() => this.createArticleFormGroups())
      );
  }

  ngOnChanges(changes: SimpleChanges): void {
  }

  onAddArticleClicked(end: boolean) {
    this.articleService.addArticleBlockToArticle(this.article.id, end)
      .pipe(
        tap(articleBlock => {
          if (end) {
            this.articleBlockFormArray.insert(this.articleBlockFormArray.length,
              this.createArticleBlockFormGroup(articleBlock, -1)
            );
          } else {
            this.articleBlockFormArray.insert(0,
              this.createArticleBlockFormGroup(articleBlock, 0)
            );
          }
        }),
        tap(articleBlock => {
          const a = {
            ...this.article,
            articleBlocks: this.articleBlocks,
            articleBlockIds: this.articleBlocks.map(b => b.id),
            selectedArticleBlock: articleBlock,
            selectedArticleBlockId: articleBlock.id
          };
          this.store.dispatch(new SelectArticle({article: a}));
        })
      )
      .subscribe();
  }

  onSaveArticle() {
    const abIds = this.articleBlocks.map((ab: ArticleBlock) => ab.id);
    const article = {
      ...this.articleFormGroup.value,
      articleBlockIds: abIds
    };
    this.articleService.saveArticle(article)
      .pipe(
        tap(() => this.articleFormGroup.markAsPristine()),
        tap(aSaved => this.store.dispatch(new SelectArticle({article: aSaved})))
      )
      .subscribe();
  }

  onSelectArticleBlock(a: FormGroup) {
    this.articleService.selectArticleBlock(this.article, a.value.id)
      .pipe(
        tap(articleSaved => this.store.dispatch(new SelectArticle({article: articleSaved})))
      )
      .subscribe();
  }

  onDeleteArticleBlock(a: FormGroup, index: number) {
    this.articleBlockFormArray.removeAt(index);
    const aId = a.value.id;
    this.articleService.deleteArticleBlock(this.article.id, aId)
      .subscribe();
  }

  onSaveArticleBlock(articleBlock: FormGroup) {
    const aBlock = {...this.articleBlocks.find(a => a.id === articleBlock.value.id)};
    const updatedABlock = Object.assign(aBlock, articleBlock.value);
    this.articleService.saveArticleWithArticleBlock(this.article, updatedABlock)
      .pipe(
        tap(() => articleBlock.markAsPristine()),
        tap(article => this.store.dispatch(new SelectArticle({article: article})))
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

  private createArticleFormGroups() {
    const article = this.article;
    this.articleBlockFormArray = new FormArray([
      ...article.articleBlocks.map((a, index) => this.createArticleBlockFormGroup(a, index))
    ]);
    this.articleFormGroup = new FormGroup({
      id: new FormControl(article.id),
      title: new FormControl(article.title, this.titleRequireValidators),
      intro: new FormControl(article.intro, this.introValidators),
      task: new FormControl(article.task),
      status: new FormControl(article.status),
      selectedArticleBlockId: new FormControl(article.selectedArticleBlockId),
      articleBlockIds: new FormControl(article.articleBlockIds),
    });
  }

  private createArticleBlockFormGroup(block, index) {
    const titleValidators = index === 0 ? this.titleRequireValidators : this.titleValidators;
    return new FormGroup({
      id: new FormControl(block.id),
      title: new FormControl(block.title, titleValidators),
      content: new FormControl(block.content, this.contentValidators),
      state: new FormControl(block.state),
      task: new FormControl(block.task),
    });
  }
}
