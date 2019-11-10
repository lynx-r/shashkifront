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

  articleBlocksFormGroup: FormGroup;

  private readonly titleValidators: ValidatorFn[];
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
    this.contentValidators = [Validators.required,
      Validators.minLength(AppConstants.ARTICLE_CONTENT_MIN_SYMBOLS),
      Validators.maxLength(AppConstants.ARTICLE_CONTENT_MAX_SYMBOLS)
    ];
  }

  get articlesControls(): FormGroup[] {
    return (this.articleBlocksFormGroup.get('articleBlocks') as FormArray).controls as FormGroup[];
  }

  get articlesFormArray() {
    return (this.articleBlocksFormGroup.get('articleBlocks') as FormArray);
  }

  ngOnInit() {
    const articlesControls = this.articleBlocks.map(a => new FormGroup({
      id: new FormControl(a.id),
      title: new FormControl(a.title, [...this.titleValidators]),
      content: new FormControl(a.content, [...this.contentValidators]),
      state: new FormControl(a.state)
    }));
    this.articleBlocksFormGroup = new FormGroup({
      articleBlocks: new FormArray([...articlesControls])
    });
  }

  onAddArticleClicked() {
    this.articleService.addArticleBlockToArticle(this.article.id)
      .pipe(
        tap(articleBlock => {
          this.articlesFormArray.insert(0, new FormGroup({
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

  onArticlesSubmit() {
    const abIds = this.articlesFormArray.value.map((ab: ArticleBlock) => ab.id);
    const article = {
      ...this.article,
      articleBlockIds: abIds
    };
    this.articleService.saveArticle(article)
      .pipe(
        tap(aSaved => this.store.dispatch(new UpsertArticle({article: aSaved})))
      )
      .subscribe();
  }

  onDeleteArticleBlock(a: FormGroup, index: number) {
    this.articlesFormArray.removeAt(index);
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
    const tmpAB = this.articlesFormArray.at(upIndex);
    this.articlesFormArray.removeAt(index);
    this.articlesFormArray.removeAt(upIndex);
    this.articlesFormArray.insert(upIndex, a);
    this.articlesFormArray.insert(index, tmpAB);
  }

  onMoveDownArticleBlock(a: FormGroup, index: number) {
    if (index === this.articlesFormArray.length - 1) {
      return;
    }
    const downIndex = index + 1;
    const tmpAB = this.articlesFormArray.at(downIndex);
    this.articlesFormArray.removeAt(downIndex);
    this.articlesFormArray.removeAt(index);
    this.articlesFormArray.insert(index, tmpAB);
    this.articlesFormArray.insert(downIndex, a);
  }
}
