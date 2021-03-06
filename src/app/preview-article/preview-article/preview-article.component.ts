/*
 * © Copyright
 *
 * preview-article.component.ts is part of shashkifront.nosync.
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
import { Store } from '@ngrx/store';
import { getIsPrivateUserState, RootState } from '../../core/reducers/reducer.reducer';
import { Article, ArticleBlock } from '../../domain';

@Component({
  selector: 'app-preview-article',
  templateUrl: './preview-article.component.html',
  styleUrls: ['./preview-article.component.css'],
})
export class PreviewArticleComponent implements OnInit {

  @Input() article: Article;
  @Input() visiblePublic: boolean;

  clickedBlockId: string;
  authed: boolean;

  constructor(private store: Store<RootState>) {
  }

  ngOnInit(): void {
    this.store.select(getIsPrivateUserState).subscribe(authed => this.authed = authed);
  }

  isHighlightBlock(block: ArticleBlock) {
    return this.clickedBlockId === block.id;
  }

}
