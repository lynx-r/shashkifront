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

  @Output() save = new EventEmitter<ArticleBlock>();
  @Output() select = new EventEmitter();
  @Output() moveUp = new EventEmitter();
  @Output() moveDown = new EventEmitter();
  @Output() remove = new EventEmitter();
  @Output() loadPdnEvent = new EventEmitter<ArticleBlock>();

  visible: boolean;
  tags: { [key: string]: string };
  minTitleLength = AppConstants.ARTICLE_TITLE_MIN_SYMBOLS;
  minContentLength = AppConstants.ARTICLE_CONTENT_MIN_SYMBOLS;

  constructor(
    private store: Store<fromArticle.State>,
  ) {
    this.tags = {};
  }

  get articleBlock() {
    return this.articleFormGroup.value;
  }

  get title() {
    return this.articleFormGroup.get('title') as FormControl;
  }

  get content() {
    return this.articleFormGroup.get('content') as FormControl;
  }

  get state() {
    return this.articleFormGroup.get('state') as FormControl;
  }

  ngOnInit() {
    this.visible = this.state.value === AppConstants.ARTICLE_BLOCK_OPENED;
  }

  ngOnChanges(): void {
    this.ngOnInit();
  }

  onVisibilityToggle() {
    this.visible = !this.visible;
    const state = this.visible ? AppConstants.ARTICLE_BLOCK_OPENED : AppConstants.ARTICLE_BLOCK_CLOSED;
    this.state.setValue(state);
    this.save.emit(this.articleBlock);
  }

}
