/*
 * © Copyright
 *
 * board.component.ts is part of shashkifront.nosync.
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

import { ChangeDetectionStrategy, Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges } from '@angular/core';
import { Store } from '@ngrx/store';
import * as _ from 'lodash';
import { AppConstants } from '../../../core/config/app-constants';
import { ArticleBlock, BoardCell, Rule } from '../../../domain';
import { BLACK_PIECE, EMPTY_CELL } from '../../../domain/board-cell';
import * as fromArticle from '../../reducers/article.reducer';
import { BoardService } from '../../services/board.service';

@Component({
  selector: 'app-board',
  templateUrl: './board.component.html',
  styleUrls: ['./board.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class BoardComponent implements OnInit, OnChanges {

  @Input() article: ArticleBlock;

  @Output() articleUpdated = new EventEmitter<ArticleBlock>();

  flatCells: BoardCell[];
  cellNotation: string;

  constructor(private store: Store<fromArticle.State>,
              private boardService: BoardService) {
  }

  get cellCount() {
    return (this.article.notation.notationFen.rule as Rule).cellCount;
  }

  get rangeCellCount() {
    return _.range(1, this.cellCount + 1);
  }

  ngOnInit() {
    this.updateBoard();
  }

  ngOnChanges(changes: SimpleChanges): void {
    this.updateBoard();
  }

  getHorizontalAlpha(col: number) {
    return AppConstants.ALPH[col];
  }

  getVerticalNum(row: number) {
    return this.boardService.getCellNumericPart(row, this.cellCount);
  }

  isNotCellEmpty(c: BoardCell) {
    return c.condition !== EMPTY_CELL;
  }

  isTileBlack(c: BoardCell) {
    return (c.col + c.row) % 2 !== 0;
  }

  isBlackPiece(c: BoardCell) {
    return c.condition === BLACK_PIECE;
  }

  getTileClasses(c: BoardCell) {
    const classes = this.isTileBlack(c) ? ['tile-black'] : ['tile-white'];
    if (c.highlight) {
      classes.push('highlight-cell');
    }
    return classes;
  }

  getDraughtClasses(c: BoardCell) {
    const black = this.isBlackPiece(c);
    const classes = black ? ['black-draught'] : ['white-draught'];
    if (c.kingPiece) {
      if (black) {
        classes.push('queen-black-draught');
      } else {
        classes.push('queen-white-draught');
      }
    }
    return classes;
  }

  onCellClick(cell: BoardCell) {
    if (!!this.article.notation.winner || this.article.status === AppConstants.ARTICLE_PUBLISHED_STATUS) {
      return;
    }
    this.boardService.touchCell(this.article.id, cell)
      .subscribe(patch => {
        if (patch.length) {
          const notation = this.boardService.applyPatchToNotation(patch, this.flatCells, this.article.notation);
          const a = {
            ...this.article,
            notation: notation
          };
          this.articleUpdated.emit(a);
        }
      });
  }

  onHoverCell(cell: BoardCell) {
    const n = this.boardService.getCellNotation(cell, this.cellCount);
    const numNotation = this.boardService.getNumericCellNotationByAlphNotation(n);
    this.cellNotation = n + '<br>' + (numNotation ? numNotation : '-');
  }

  private updateBoard() {
    this.flatCells = this.boardService.getActualBoardCellsForNotation(this.article.notation);
  }
}
