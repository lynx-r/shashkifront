/*
 * © Copyright
 *
 * edit-article-block.component.ts is part of shashkifront.nosync.
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

import { Component, EventEmitter, Input, OnChanges, OnInit, Output } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { Store } from '@ngrx/store';
import { AppConstants } from '../../../core/config/app-constants';
import { ArticleBlock } from '../../../domain';
import * as fromArticle from '../../reducers/article.reducer';

@Component({
  selector: 'app-edit-article-block',
  templateUrl: './edit-article-block.component.html',
  styleUrls: ['./edit-article-block.component.css']
})
export class EditArticleBlockComponent implements OnInit, OnChanges {

  @Input() articleFormGroup: FormGroup;

  @Output() saveArticle = new EventEmitter<ArticleBlock>();
  @Output() moveUp = new EventEmitter();
  @Output() moveDown = new EventEmitter();
  @Output() deleteArticle = new EventEmitter();
  @Output() loadPdnEvent = new EventEmitter<ArticleBlock>();

  PUBLISHED = AppConstants.PUBLISHED_STATUS;
  DRAFT = AppConstants.DRAFT_STATUS;

  visible: boolean;
  tags: { [key: string]: string };
  minTitleLength = AppConstants.ARTICLE_TITLE_MIN_SYMBOLS;
  minContentLength = AppConstants.ARTICLE_CONTENT_MIN_SYMBOLS;

  constructor(
    private store: Store<fromArticle.State>,
  ) {
    this.tags = {};
  }

  get article() {
    return this.articleFormGroup.value;
  }

  get title() {
    return this.articleFormGroup.get('title') as FormControl;
  }

  get content() {
    return this.articleFormGroup.get('content') as FormControl;
  }

  get status() {
    return this.articleFormGroup.get('status') as FormControl;
  }

  ngOnInit() {
    this.visible = this.status.value === AppConstants.NEW_STATUS;
  }

  ngOnChanges(): void {
    this.ngOnInit();
  }

  onVisibilityToggle() {
    this.visible = !this.visible;
  }

  onDeleteClicked() {
    this.deleteArticle.emit();
  }
}
