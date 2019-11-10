/*
 * © Copyright
 *
 * view-notation.component.ts is part of shashkifront.nosync.
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

import { ChangeDetectionStrategy, Component, Input, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { Store } from '@ngrx/store';
import { Article, Move, Stroke } from '../../../domain';
import { UpsertArticle } from '../../actions/article.actions';
import * as fromArticle from '../../reducers/article.reducer';
import { BoardService } from '../../services/board.service';

@Component({
  selector: 'app-view-notation',
  templateUrl: './view-notation.component.html',
  styleUrls: ['./view-notation.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ViewNotationComponent implements OnInit, OnChanges {

  @Input() article: Article;

  get selectedArticleBoard() {
    return this.article.selectedArticleBlock;
  }

  get notation() {
    return this.selectedArticleBoard.notation;
  }

  constructor(private store: Store<fromArticle.State>,
              private boardService: BoardService) {
  }

  ngOnInit() {
    const sStroke = this.notation.strokes.find(s => s.selected);
    if (!!sStroke) {
      const sMove = this.boardService.findSelectedMoveInStroke(sStroke);
      this.onStrokeClicked(sMove, sStroke);
    } else {
      this.onStrokeClicked(null, this.notation.strokes[0]);
    }
  }

  ngOnChanges(changes: SimpleChanges): void {
  }

  onStrokeClicked(move: Move, stroke: Stroke) {
    const article = this.boardService.highlightClickedMoveInArticle(this.article, stroke, move);
    this.store.dispatch(new UpsertArticle({article: article}));
  }
}
