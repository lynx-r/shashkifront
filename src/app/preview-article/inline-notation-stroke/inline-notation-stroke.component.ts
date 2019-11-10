/*
 * © Copyright
 *
 * inline-notation-stroke.component.ts is part of shashkifront.nosync.
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

import { ChangeDetectionStrategy, Component, Input, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { SelectArticle } from '../../article/actions/article.actions';
import { BoardService } from '../../article/services/board.service';
import { RootState } from '../../core/reducers/reducer.reducer';
import { Article, ArticleBlock, Move, Rule, Stroke } from '../../domain';
import { ContentComponent } from '../preview-article/content-component';

@Component({
  selector: 'app-inline-notation-stroke',
  templateUrl: './inline-notation-stroke.component.html',
  styleUrls: ['./inline-notation-stroke.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class InlineNotationStrokeComponent implements OnInit, ContentComponent {

  @Input() data: { article: Article, articleBlock: ArticleBlock, notationNum: number };

  stroke: Stroke;

  constructor(private store: Store<RootState>,
              private boardService: BoardService) {
  }

  get article() {
    return this.data.article;
  }

  get articleBlock() {
    return this.data.articleBlock;
  }

  get cellCount() {
    return (this.notation.notationFen.rule as Rule).cellCount;
  }

  get notation() {
    return this.articleBlock.notation;
  }

  ngOnInit() {
    this.stroke = this.notation.strokes.find(s => s.notationNumber === this.data.notationNum);
  }

  onMoveClicked(move: Move) {
    const article = this.boardService.highlightClickedMoveInArticle(this.article, this.stroke, move);
    this.store.dispatch(new SelectArticle({article: article}));
  }

}
