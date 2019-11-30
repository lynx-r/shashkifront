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

import { Component, Input, OnChanges, OnDestroy, OnInit, SimpleChanges } from '@angular/core';
import { FormArray, FormControl, FormGroup, ValidatorFn, Validators } from '@angular/forms';
import { Store } from '@ngrx/store';
import { untilComponentDestroyed } from '@w11k/ngx-componentdestroyed';
import { Observable } from 'rxjs';
import { map, tap } from 'rxjs/operators';
import { AppConstants } from '../../../core/config/app-constants';
import { ArticleService } from '../../../core/services/article.service';
import { Article, ArticleBlock } from '../../../domain';
import { SelectArticle } from '../../actions/article.actions';
import * as fromArticle from '../../reducers/article.reducer';
import { selectCurrentArticle, selectCurrentArticlePublished } from '../../reducers/article.reducer';

@Component({
  selector: 'app-edit-article-blocks',
  templateUrl: './edit-article-blocks.component.html',
  styles: []
})
export class EditArticleBlocksComponent implements OnInit, OnChanges, OnDestroy {

  @Input() article: Article;

  published$: Observable<boolean>;
  selectedArticleBlockId$: Observable<string>;

  articleFormGroup: FormGroup;
  articleBlockFormArray: FormArray;

  private readonly titleValidators: ValidatorFn[];
  private readonly titleRequireValidators: ValidatorFn[];
  private readonly contentValidators: ValidatorFn[];

  get articlesControls(): FormGroup[] {
    return this.articleBlockFormArray.controls as FormGroup[];
  }

  get articleBlocks() {
    return this.articleBlockFormArray.value;
  }

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
    this.contentValidators = [Validators.required,
      Validators.minLength(AppConstants.ARTICLE_CONTENT_MIN_SYMBOLS),
      Validators.maxLength(AppConstants.ARTICLE_CONTENT_MAX_SYMBOLS)
    ];
  }

  ngOnInit(): void {
    this.published$ = this.store.select(selectCurrentArticlePublished);
    this.selectedArticleBlockId$ = this.store.select(selectCurrentArticle)
      .pipe(
        map(a => a.selectedArticleBlockId)
      );
    this.createArticleFormGroups();
    this.store.select(selectCurrentArticlePublished)
      .pipe(
        tap(() => this.createArticleFormGroups()),
        untilComponentDestroyed(this)
      );
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (!!this.articleFormGroup && this.article.id !== this.articleFormGroup.value.id) {
      // new article
      this.createArticleFormGroups();
    } else if (!!this.articleFormGroup) {
      const selectedBlockIndex = this.article.articleBlocks.findIndex(a => a.id === this.article.selectedArticleBlockId);
      const selBlock = this.articleBlockFormArray.at(selectedBlockIndex);
      selBlock.get('task').setValue(this.article.articleBlocks[selectedBlockIndex].task);
    }
  }

  ngOnDestroy(): void {
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
          let articleBlocks;
          if (end) {
            articleBlocks = [...this.article.articleBlocks, articleBlock];
          } else {
            articleBlocks = [articleBlock, ...this.article.articleBlocks];
          }
          const a = {
            ...this.article,
            articleBlocks: articleBlocks,
            articleBlockIds: articleBlocks.map(b => b.id),
            selectedArticleBlock: articleBlock,
            selectedArticleBlockId: articleBlock.id,
          };
          this.store.dispatch(new SelectArticle({article: a}));
        }),
        untilComponentDestroyed(this)
      )
      .subscribe();
  }

  onSelectArticleBlock(a: FormGroup) {
    this.articleService.selectArticleBlock(this.article, a.value.id)
      .pipe(
        tap(articleSaved => this.store.dispatch(new SelectArticle({article: articleSaved}))),
        untilComponentDestroyed(this)
      )
      .subscribe();
  }

  onDeleteArticleBlock(a: FormGroup, index: number) {
    this.articleBlockFormArray.removeAt(index);
    const aId = a.value.id;
    this.articleService.deleteArticleBlock(this.article.id, aId)
      .pipe(
        tap(() => {
          const articleBlocks = [...this.article.articleBlocks];
          articleBlocks.splice(index, 1);
          const abIds = articleBlocks.map(ab => ab.id);
          const firstBlock = articleBlocks[0];
          const article = {
            ...this.article,
            articleBlocks: articleBlocks,
            articleBlockIds: abIds,
            selectedArticleBlock: firstBlock,
            selectedArticleBlockId: firstBlock.id,
          };
          this.store.dispatch(new SelectArticle({article: article}));
        }),
        untilComponentDestroyed(this)
      )
      .subscribe();
  }

  onSaveArticleBlock(articleBlock: FormGroup) {
    if (articleBlock.pristine) {
      return;
    }
    const aBlock = {...this.articleBlocks.find(a => a.id === articleBlock.value.id), notation: null};
    // const updatedABlock = Object.assign(aBlock, articleBlock.value);
    this.articleService.saveArticleWithArticleBlock(this.article, aBlock)
      .pipe(
        tap(() => articleBlock.markAsPristine()),
        tap(article => this.store.dispatch(new SelectArticle({article: article}))),
        untilComponentDestroyed(this)
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
    this.saveArticleBlockIds();
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
    this.saveArticleBlockIds();
  }

  private saveArticleBlockIds() {
    const abIds = this.articleBlocks.map((ab: ArticleBlock) => ab.id);
    const article = {
      ...this.article,
      articleBlockIds: abIds
    };
    this.articleService.saveArticle(article)
      .pipe(
        tap(() => this.articleFormGroup.markAsPristine()),
        tap(aSaved => this.store.dispatch(new SelectArticle({article: aSaved}))),
        untilComponentDestroyed(this)
      )
      .subscribe();
  }

  private createArticleFormGroups() {
    const article = this.article;
    this.articleBlockFormArray = new FormArray([
      ...article.articleBlocks.map((a, index) => this.createArticleBlockFormGroup(a, index))
    ]);
    this.articleFormGroup = new FormGroup({
      id: new FormControl(article.id),
      task: new FormControl(article.task),
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
      notation: new FormControl(block.notation),
    });
  }
}
