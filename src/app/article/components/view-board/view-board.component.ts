/*
 * © Copyright
 *
 * view-board.component.ts is part of shashkifront.nosync.
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
import { Store } from '@ngrx/store';
import * as _ from 'lodash';
import { AppConstants } from '../../../core/config/app-constants';
import { NotifyService } from '../../../core/services/notify.service';
import { Article, ArticleBlock, BoardCell, Move, Rule, Stroke } from '../../../domain';
import { BLACK_PIECE, EMPTY_CELL } from '../../../domain/board-cell';
import { SelectArticle } from '../../actions/article.actions';
import * as fromArticle from '../../reducers/article.reducer';
import { BoardService } from '../../services/board.service';

@Component({
  selector: 'app-view-board',
  templateUrl: './view-board.component.html',
  styleUrls: ['./view-board.component.scss'],
})
export class ViewBoardComponent implements OnInit, OnChanges {

  @Input() article: Article;

  flatCells: BoardCell[];
  cellNotation: string;

  disableForward: boolean;
  disableBackward: boolean;

  private moveNum: number;
  private moves: Move[];
  private solved: boolean;

  constructor(private store: Store<fromArticle.State>,
              private boardService: BoardService,
              private notifyService: NotifyService) {
  }

  get selectedArticleBoard() {
    return this.article.selectedArticleBlock;
  }

  set selectedArticleBoard(articleBlock: ArticleBlock) {
    this.article = {
      ...this.article,
      selectedArticleBlock: articleBlock
    };
  }

  get notation() {
    return this.selectedArticleBoard.notation;
  }

  get cellCount() {
    return (this.notation.notationFen.rule as Rule).cellCount;
  }

  get rangeCellCount() {
    return _.range(1, this.cellCount + 1);
  }

  ngOnInit() {
    // this.disableForward = this.selectedArticleBoard.task && !this.solved;
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
    if (!!this.notation.winner || this.solved || !this.selectedArticleBoard.task) {
      return;
    }
    this.moveNum++;
    const {move, stroke} = this.findMoveByNumFromStrokes();
    this.moveNum--;
    if (this.boardService.equalsCellsByPosition(move.to, cell)) {
      this.updateIfStrokeSolved(stroke, move);
      this.onForwardClicked();
    } else {
      this.notifyService.info('Не правильно, попробуйте ещё раз');
    }
    if (this.moveNum === this.moves.length - 1) {
      this.notifyService.success('Ура! Вы решили задачу!');
      this.solved = true;
      return;
    }
  }

  onHoverCell(cell: BoardCell) {
    const n = this.boardService.getCellNotation(cell, this.cellCount);
    const numNotation = this.boardService.getNumericCellNotationByAlphNotation(n);
    this.cellNotation = n + '<br>' + (numNotation ? numNotation : '-');
  }

  onForwardClicked() {
    if (this.moveNum === this.moves.length - 1) {
      this.disableForward = true;
      return;
    }
    this.moveNum++;
    this.disableBackward = false;
    const {move, stroke} = this.findMoveByNumFromStrokes();
    const article = this.boardService.highlightClickedMoveInArticle(this.article, stroke, move);
    this.store.dispatch(new SelectArticle({article: article}));
    if (this.moveNum === this.moves.length - 1) {
      this.disableForward = true;
    }
  }

  onBackwardClicked() {
    if (this.moveNum === -2) {
      return;
    }
    this.disableForward = this.selectedArticleBoard.task && !this.solved;
    this.moveNum--;
    if (this.moveNum === -1) {
      this.disableBackward = true;
      const stroke = this.notation.strokes[0];
      const article = this.boardService.highlightClickedMoveInArticle(this.article, stroke, null);
      this.store.dispatch(new SelectArticle({article: article}));
    } else {
      const {move, stroke} = this.findMoveByNumFromStrokes();
      const article = this.boardService.highlightClickedMoveInArticle(this.article, stroke, move);
      this.store.dispatch(new SelectArticle({article: article}));
    }
  }

  private updateBoard() {
    this.flatCells = this.boardService.getActualBoardCellsForNotation(this.notation);
    this.moves = this.boardService.flattenStrokes(this.notation.strokes);
    this.moveNum = this.moves.findIndex(m => m.selected);
    this.disableForward = this.selectedArticleBoard.task && !this.solved;
    this.disableBackward = this.moveNum === -1;
  }

  private findMoveByNumFromStrokes() {
    const move = this.moves[this.moveNum];
    const stroke = this.notation.strokes.find(s => s.whiteMoves.some(m => m === move) || s.blackMoves.some(m => m === move));
    return {move, stroke};
  }

  private updateIfStrokeSolved(stroke: Stroke, move: Move) {
    if (stroke.blackMoves[stroke.blackMoves.length - 1] === move || stroke.blackMoves.length === 0) {
      this.selectedArticleBoard = {
        ...this.selectedArticleBoard,
        notation: {
          ...this.notation,
          strokes: this.notation.strokes.map(s => {
            if (s.notationNumber === stroke.notationNumber) {
              return {
                ...stroke,
                task: false
              };
            }
            return s;
          })
        }
      };
    }
  }
}
