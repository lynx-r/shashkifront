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

import { Component, EventEmitter, Input, OnChanges, OnInit, Output, ViewChild } from '@angular/core';
import { NgModel } from '@angular/forms';
import { Store } from '@ngrx/store';
import { AppConstants } from '../../../core/config/app-constants';
import { ArticleBlock } from '../../../domain';
import * as fromArticle from '../../reducers/article.reducer';

@Component({
  selector: 'app-edit-article',
  templateUrl: './edit-article.component.html',
  styleUrls: ['./edit-article.component.css']
})
export class EditArticleComponent implements OnInit, OnChanges {

  @Input() article: ArticleBlock;

  @Output() loadPdnEvent = new EventEmitter<ArticleBlock>();

  @ViewChild('content', {static: true}) content: NgModel;
  @ViewChild('title', {static: true}) title: NgModel;

  PUBLISHED = AppConstants.ARTICLE_PUBLISHED_STATUS;
  DRAFT = AppConstants.ARTICLE_DRAFT_STATUS;

  editArticle: ArticleBlock;

  minIntroLength = AppConstants.ARTICLE_INTRO_MIN_SYMBOLS;
  maxIntroLength = AppConstants.ARTICLE_INTRO_MAX_SYMBOLS;
  minContentLength = AppConstants.ARTICLE_CONTENT_MIN_SYMBOLS;
  minTitleLength = AppConstants.ARTICLE_TITLE_MIN_SYMBOLS;
  maxTitleLength = AppConstants.ARTICLE_TITLE_MAX_SYMBOLS;

  tags: { [key: string]: string };

  constructor(
    private store: Store<fromArticle.State>,
  ) {
    this.tags = {};
  }

  ngOnInit() {
    this.editArticle = {...this.article};
  }

  ngOnChanges(): void {
    this.ngOnInit();
  }

  saveArticle() {
    // this.store.dispatch(new SaveArticle({article: this.editArticle}));
  }

  onStatusClicked(status: string) {
    const a = {
      ...this.editArticle,
      status: status
    };
    // this.store.dispatch(new SaveArticle({article: a}));
  }
}
